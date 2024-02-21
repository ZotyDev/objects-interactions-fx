const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sass = require('sass');

const outputDir = 'module';
const outputFile = path.join(outputDir, "module.min.js");
const sassInputDir = 'src/styles';
const hbsInputDir = 'src/templates';
const langInputDir = 'src/lang';

// Function to create output directory if it doesn't exist
function createOutputDir(callback) {
  fs.mkdir(outputDir, { recursive: true }, (err) => {
    if (err) {
      console.error(`Error creating output directory: ${err}`);
      return;
    }
    console.log(`Output directory '${outputDir}' created successfully.`);
    callback();
  });
}

// Function to compile TypeScript (tsc)
function compileTypeScript(callback) {
  console.log('Compiling TypeScript...');
  exec('tsc', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error compiling TypeScript: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`STDERR error while compiling TypeScript: ${stderr}`);
      return;
    }
    console.log('TypeScript compiled successfully.');
    callback();
  });
}

// Function to compile Sass to CSS
function compileSass(callback) {
  console.log('Compiling Sass to CSS...');
  fs.readdir(sassInputDir, (err, files) => {
    if (err) {
      console.error(`Error reading Sass files: ${err}`);
      return;
    }

    files.forEach(file => {
      if (file.endsWith('.sass')) {
        const sassInputFile = path.join(sassInputDir, file);
        const sassOutputFile = path.join(outputDir, path.basename(file, path.extname(file)) + '.css');
        sass.render({
          file: sassInputFile,
          outputStyle: 'compressed'
        }, (err, result) => {
          if (err) {
            console.error(`Error compiling Sass file ${sassInputFile}: ${err}`);
            return;
          }
          fs.writeFile(sassOutputFile, result.css, (err) => {
            if (err) {
              console.error(`Error writing CSS file ${sassOutputFile}: ${err}`);
              return;
            }
            console.log(`Sass file ${sassInputFile} compiled to ${sassOutputFile}`);
          });
        });
      }
    });
    callback();
  });
}

function copyHbsFiles(callback) {
  console.log('Copying .hbs files to output directory...');

  function copyFilesRecursively(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      const targetPath = path.join(outputDir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        copyFilesRecursively(fullPath);
      } else if (file.endsWith('.hbs')) {
        fs.copyFile(fullPath, targetPath, (err) => {
          if (err) {
            console.error(`Error copying .hbs file ${fullPath} to ${targetPath}: ${err}`);
            return;
          }
          console.log(`.hbs file ${fullPath} copied to ${targetPath}`);
        });
      }
    });
  }

  copyFilesRecursively(hbsInputDir);
  callback();
}

function copyLangFiles(callback) {
  console.log('Copying lang files to output directory...');

  fs.readdirSync(langInputDir).forEach(file => {
    const fullPath = path.join(langInputDir, file);
    const targetPath = path.join(outputDir, file);

    fs.copyFile(fullPath, targetPath, (err) => {
      if (err) {
        console.error(`Error copying .hbs file ${fullPath} to ${targetPath}: ${err}`);
        return;
      }
      console.log(`.hbs file ${fullPath} copied to ${targetPath}`);
    });
  })
}

// Function to concatenate and minify JavaScript files
function concatAndMinify(callback) {
  console.log('Concatenating and minifying JavaScript files...');

  const directoryPath = path.join(__dirname, 'out');
  readFilesRecursively(directoryPath, (err, filePaths) => {
    if (err) {
      console.error(`Error reading files: ${err}`);
      return;
    }

    const jsFiles = filePaths.filter(file => file.endsWith('.js'));
    const command = `uglifyjs ${jsFiles.join(' ')} -o ${outputFile}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running UglifyJS command: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`STDERR error while running UglifyJS command: ${stderr}`);
        return;
      }
      console.log('JavaScript files concatenated and minified successfully.');
      callback();
    });
  });
}

// Function to read files recursively within a directory
function readFilesRecursively(directoryPath, callback) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      callback(err, null);
      return;
    }

    let filePaths = [];

    function readFile(index) {
      if (index === files.length) {
        callback(null, filePaths);
        return;
      }

      const filePath = path.join(directoryPath, files[index]);

      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error(`Error reading file ${filePath}: ${err}`);
          readFile(index + 1);
          return;
        }

        if (stat.isDirectory()) {
          readFilesRecursively(filePath, (err, subDirectoryFiles) => {
            if (err) {
              console.error(`Error reading directory ${filePath}: ${err}`);
              readFile(index + 1);
              return;
            }
            filePaths = filePaths.concat(subDirectoryFiles);
            readFile(index + 1);
          });
        } else {
          filePaths.push(filePath);
          readFile(index + 1);
        }
      });
    }

    readFile(0);
  });
}

// Execute TypeScript compilation first, then create output directory, compile Sass, copy .hbs files, concatenate and minify JavaScript files
compileTypeScript(() => {
  createOutputDir(() => {
    compileSass(() => {
      copyHbsFiles(() => {
        copyLangFiles(() => {
          concatAndMinify(() => {
            console.log('Build process completed.');
          });
        });
      });
    });
  });
});
