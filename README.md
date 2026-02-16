# ngDuckDb - Angular 20 with DuckDB-WASM

A demonstration Angular 20 application that integrates DuckDB-WASM to store and retrieve data in the browser using Web Workers.

## Features

- **Angular 20**: Built with the latest Angular framework using standalone components
- **Angular Material**: Modern Material Design UI components
- **DuckDB-WASM**: In-browser SQL database powered by WebAssembly
- **Web Workers**: Database operations run in a separate worker thread for optimal performance
- **Tabular Data Display**: Interactive Material table to display query results

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Build

Build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

1. Click the **Insert Data** button to insert sample data into the DuckDB database
2. Click the **Load Data** button to query and display the data in an Angular Material table

## Architecture

- **Web Worker**: Database operations are handled in a dedicated web worker (`duckdb.worker.ts`)
- **DuckDB-WASM**: Local WASM bundles are served from the assets directory
- **Standalone Components**: Uses Angular's modern standalone component architecture
- **Signals**: Leverages Angular signals for reactive state management

## Screenshots

### Initial View
![Initial View](https://github.com/user-attachments/assets/429d1758-3598-4147-b703-67714d7790af)

### After Inserting Data
![After Insert](https://github.com/user-attachments/assets/e072f96c-47d4-4f75-8e44-7a1384bfea6a)

### Data Loaded in Table
![Data Table](https://github.com/user-attachments/assets/7b52d9cc-c650-4260-a94f-0ebc76d51cbb)

## Technologies

- Angular 20.3
- Angular Material 20.2
- DuckDB-WASM 1.30
- TypeScript 5.9
- RxJS 7.8

## License

This project is licensed under the MIT License - see the LICENSE file for details.
