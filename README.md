# GridListMatrix - Custom Power BI Matrix

Custom Matrix visual for Power BI with a real **Show Column Header** switch.

## Feature

`Format -> Matrix Header -> Show Column Header`

- **On:** column header rows are rendered.
- **Off:** column header rows are not created in the DOM at all, so the white header area is not reserved by this visual.

## GitHub build

No Node.js installation is required on the user's PC. GitHub Actions installs Node.js and `powerbi-visuals-tools@2.5.0`, then packages the `.pbiviz`.

Microsoft's archived SampleMatrix is used as the conceptual reference; this repository contains the self-contained implementation. The Microsoft SampleMatrix repository is archived and its README specifically recommends pbiviz 2.5.0.
