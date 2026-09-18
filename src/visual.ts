import powerbi from "powerbi-visuals-api";
import IVisual = powerbi.extensibility.visual.IVisual;
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataViewMatrix = powerbi.DataViewMatrix;
import DataViewMatrixNode = powerbi.DataViewMatrixNode;
import DataViewObjects = powerbi.DataViewObjects;

interface HeaderSettings {
    showColumnHeader: boolean;
    headerBackground: string;
    headerTextColor: string;
    headerFontSize: number;
}

export class Visual implements IVisual {
    private root: HTMLElement;
    private settings: HeaderSettings = {
        showColumnHeader: true,
        headerBackground: "#ffffff",
        headerTextColor: "#333333",
        headerFontSize: 11
    };

    constructor(options: VisualConstructorOptions) {
        this.root = options.element;
        this.root.classList.add("customMatrixRoot");
    }

    public update(options: VisualUpdateOptions): void {
        this.root.innerHTML = "";
        const dataView = options.dataViews && options.dataViews[0];
        if (!dataView || !dataView.matrix) {
            return;
        }

        this.readSettings(dataView.metadata && dataView.metadata.objects);
        const matrix = dataView.matrix;
        const table = document.createElement("table");
        table.className = "customMatrix";
        table.style.fontSize = "11px";

        if (this.settings.showColumnHeader && matrix.columns && matrix.columns.root) {
            const headerRows = this.buildColumnHeaders(matrix.columns.root);
            headerRows.forEach((cells: string[]) => {
                const tr = document.createElement("tr");
                tr.className = "matrixHeaderRow";
                cells.forEach((text: string) => {
                    const th = document.createElement("th");
                    th.textContent = text;
                    th.style.background = this.settings.headerBackground;
                    th.style.color = this.settings.headerTextColor;
                    th.style.fontSize = this.settings.headerFontSize + "px";
                    tr.appendChild(th);
                });
                table.appendChild(tr);
            });
        }

        if (matrix.rows && matrix.rows.root) {
            this.renderRows(table, matrix.rows.root, []);
        }

        this.root.appendChild(table);
    }

    private readSettings(objects: DataViewObjects): void {
        const header: any = objects && (objects as any)["header"];
        if (!header) { return; }
        if (header["showColumnHeader"] !== undefined) {
            this.settings.showColumnHeader = !!header["showColumnHeader"];
        }
        if (header["headerBackground"] && header["headerBackground"].solid) {
            this.settings.headerBackground = header["headerBackground"].solid.color;
        }
        if (header["headerTextColor"] && header["headerTextColor"].solid) {
            this.settings.headerTextColor = header["headerTextColor"].solid.color;
        }
        if (header["headerFontSize"] !== undefined) {
            this.settings.headerFontSize = Number(header["headerFontSize"]);
        }
    }

    private buildColumnHeaders(root: DataViewMatrixNode): string[][] {
        const rows: string[][] = [];
        const walk = (node: DataViewMatrixNode, depth: number): void => {
            if (!rows[depth]) { rows[depth] = []; }
            const value = node.value === undefined || node.value === null ? "" : String(node.value);
            rows[depth].push(value);
            if (node.children) {
                node.children.forEach((child: DataViewMatrixNode) => walk(child, depth + 1));
            }
        };
        if (root.children) {
            root.children.forEach((child: DataViewMatrixNode) => walk(child, 0));
        }
        return rows;
    }

    private renderRows(table: HTMLTableElement, root: DataViewMatrixNode, path: string[]): void {
        if (!root.children) { return; }
        root.children.forEach((node: DataViewMatrixNode) => {
            const tr = document.createElement("tr");
            tr.className = "matrixDataRow";
            const label = document.createElement("td");
            label.className = "matrixRowLabel";
            label.textContent = node.value === undefined || node.value === null ? "" : String(node.value);
            tr.appendChild(label);

            if (node.values) {
                const values: any = node.values;
                Object.keys(values).forEach((key: string) => {
                    const cell = document.createElement("td");
                    const item: any = values[key];
                    cell.textContent = item && item.value !== undefined ? String(item.value) : "";
                    tr.appendChild(cell);
                });
            }
            table.appendChild(tr);
            if (node.children) {
                this.renderRows(table, node, path.concat([String(node.value)]));
            }
        });
    }

    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
        if (options.objectName !== "header") { return []; }
        return [{
            objectName: "header",
            properties: {
                showColumnHeader: this.settings.showColumnHeader,
                headerBackground: { solid: { color: this.settings.headerBackground } },
                headerTextColor: { solid: { color: this.settings.headerTextColor } },
                headerFontSize: this.settings.headerFontSize
            },
            selector: null
        } as VisualObjectInstance];
    }
}
