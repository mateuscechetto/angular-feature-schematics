# Feature-focused Angular Schematics

Schematics that I use in my Angular projects, following a feature-focused structure:

- My app is split in features, layout and shared.
- Each feature has:
  - **data-access:** Services and shared state for the feature.
  - **feature:** Feature smart component. I use suffix `page` instead of `component` so it is easier to recognize it is a smart component.
  - **ui:** Dumb component for UI. (buttons, lists, tables, inputs, etc.)

## What does it do?

It generates boilerplate folders/files for a new feature:

- Creates a folder with the name of the feature. Inside that folder it creates:
  - data-access folder, with a service for the feature. it also injects http for the service.
  - feature folder, with the component for the feature with the feature service injected, html file for the component and a routes archive for the feature.
- Updates tsconfig paths to use `@feature-name` instead of relative imports
- Adds the new route to `main.ts` `ROUTES` constant. In some projects I didn't have it, I was writing the routes directly on the `provideRouter` so I had to create the `ROUTES` const. **Important**: Since in all my projects I have a `not-found` page and a wildcard route (`**`), the schematics uses adds it in the position of the wildcard - 2, so if you don't have those, you can edit the `feature/src/feature/index.ts` file.

## How to use it?

Clone this project:

    git clone https://github.com/mateuscechetto/angular-feature-schematics.git

Go to feature schematic folder:

    cd feature

Build the schematic:

    npm run build

Link it so it can be used in other projects:

    npm link

In the angular project you link to this schematic:

    npm link <path_for_the_schematic>

_Note:_ it is _likely_ that it look like `../../angular-feature-schematics/feature`;

Use the schematic whenever you want to add a new feature:

    ng generate feature:generate-feature --name=<feature_name>

## More about Angular schematics:

- [Playing with Schematics — Angular](https://nado261.medium.com/schematics-angular-5110c008f0f)
- [Generating code using schematics](https://angular.dev/tools/cli/schematics)
- [Schematics authoring](https://angular.dev/tools/cli/schematics-authoring)
