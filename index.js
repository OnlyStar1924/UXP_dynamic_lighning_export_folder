const { entrypoints } = require("uxp");

// Set up entry points -- this defines the handler for menu items
// If this plugin had a panel, we would define flyout menu items here
entrypoints.setup({
  commands: {
    run: () => main()
  }
});

async function main(){
  const app = require('photoshop').app;
  app.bringToFront();

  const fs = require("uxp").storage.localFileSystem;

  const actionSet = app.actionTree;
  var action_uxp;

  for(var i=0; i<actionSet.length; i++){
    if(actionSet[i].name == 'UXP_dynamic_lighning'){
      action_uxp = actionSet[i];
      break;
    }
  }
  // console.log(action_uxp.actions)
  const action_dynamic_light = action_uxp.actions

  // open folder location
  inputDir = await fs.getFolder();

  // alert choose outfile
  await app.showAlert("Select Output Folder");

  // select output folder
  const outputDir = await fs.getFolder();

  // read file name of input
  var inputArray = await inputDir.getEntries();

  //loop tung file
  var listCat = [];
  var catFolder;
  var themeFolder;
  var indexCat = 0;
  var indexTheme = 0;
  for (var i = 0; i < inputArray.length; i++){
    if (inputArray[i].name.slice(-4) == ".psd" || inputArray[i].name.slice(-4) == ".psb"){
      var category = '';
      var theme = '';
      var j =0
      for(j; j< inputArray[i].name.length; j++){
        if (inputArray[i].name[j] == '_'){
          break
        }else{
          category += inputArray[i].name[j]
        }
      }
      j++;
      for(j; j< inputArray[i].name.length; j++){
        if (inputArray[i].name[j] == '.'){
          break
        }else{
          theme += inputArray[i].name[j]
        }
      }
      // console.log(category);
      // console.log(theme);
      if (listCat[listCat.length -1] != category){
        listCat.push(category);

        var strIndexCat = '';
        if(indexCat < 10){
          strIndexCat = '00';
        }else if(indexCat < 100){
          strIndexCat = '0';
        }

        catFolder = await outputDir.createFolder(strIndexCat + indexCat + formatString(category));
        indexCat++;
        indexTheme = 0;
      }

      var strIndexTheme = '';
      if(indexTheme < 10){
        strIndexTheme = '00';
      }else if(indexTheme < 100){
        strIndexTheme = '0';
      }

      themeFolder = await catFolder.createFolder(strIndexTheme + indexTheme + formatString(theme));
      indexTheme++;

      var doc_next = await app.open(inputArray[i]);

      // // action dynamic ligthning
      // for(var k = 0; k < action_dynamic_light.length; k++){
      //   await action_dynamic_light[k].play();
      //   var tempFile = await themeFolder.createFile("image_" + action_dynamic_light[k].name + '.png');
      //   await doc_next.save(tempFile);
      // }

      // action rename
      var tempFile = await themeFolder.createFile('Store.png');
      doc_next.save(tempFile);

    doc_next.closeWithoutSaving();
    }
  }
}

function formatString(str){
  new_str ='';
  for(var i =0; i < str.length; i++){
    if(str[i] == str[i].toUpperCase()){
      new_str += " ";
    }
    new_str += str[i];
  }
  return new_str;
}