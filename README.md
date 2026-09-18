# Custom Matrix Visual

A small Power BI custom Matrix visual designed for GitHub Actions builds, so Node.js does not need to be installed on the user's PC.

## Main feature

**Format -> Matrix Header -> Show Column Header**

- On: renders column headers.
- Off: does not create the column-header rows at all.

This is intended to solve the white header area problem in the native Matrix visual without relying on white text or overlay Shapes.

## Build from GitHub

1. Create a new GitHub repository.
2. Upload all files from this folder.
3. Open **Actions**.
4. Select **Build Custom Matrix Visual**.
5. Click **Run workflow**.
6. When it completes, open the run and download **CustomMatrixVisual-pbiviz**.
7. In Power BI Desktop, import the downloaded `.pbiviz` custom visual.

The project uses Microsoft's archived Sample Matrix as the conceptual reference, but the source here is intentionally self-contained. Microsoft's archived Sample Matrix README says it should be built with pbiviz 2.5; this project instead uses the current toolchain available through npm/GitHub Actions. If your Power BI version rejects the package, the next step is to pin the build to the archived 2.5 toolchain.
