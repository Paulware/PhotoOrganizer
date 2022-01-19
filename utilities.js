   var fso = new ActiveXObject("Scripting.FileSystemObject");
   var jsonFilename = 'test1.txt';   
   var json = readJson ();
      
   function Alert (message) {
      // alert (message);
   }
      
   function clearSelect(id) {
      var element = document.getElementById (id);
      for(var i = element.options.length-1; i >= 0; i--) {
         element.remove(i);
      }
   }
      
   function addOption (item, id) {
      var select = document.getElementById (id);
      //                    Text  Value
      var option = new Option (item,item);
      select.add(option);
      return option 
   }
        
   function addAllTags(id, value) {      
      //alert ( 'addAllTags (' + id + ',' + value + ')' );
      var option; 
      var selected;
      var element = document.getElementById (id);
      var selection = 0;
      clearSelect(id); 
      tags = json.tags;   
      tags.sort();      
      option = addOption ('Any', id)
      for (var i=0; i<tags.length; i++) { 
         selected = (tags[i] == value);
         if (selected) {
            //alert ( 'This option is selected/detected: ' + value);          
            selection = i+1; // Add 1 because adding 'Any' option above
         }
         addOption (tags[i], id);
      }      
      element.selectedIndex = '' + selection;
   }   
        
   function copyFile (source, destination) { 
      retVal = true;
      //alert ( 'Copy ' + source + ' to ' + destination );
      if (!fso.FileExists (source)) {
         // alert ( 'This source file does not exist: ' + source);
         retVal = false;
      } else { 
         if (fso.FileExists (destination) ) {
            alert ( 'This file already exists...');
            retVal = false;
         } else {               
            //alert ( 'Copying: ' + source + ' to ' + destination)
            fso.CopyFile(source,destination,1);
            alert ( source + ' copied' + ' to ' + destination);
         }
      }
      return retVal;
   }   
   
   function clean (filename) { 
      var path = replaceAll ( filename, '\\', '/');
      path = replaceAll (path, '%20', ' ');
      return path;
   }   
   
   function relativePath (filename) { 
      var newFilename = filename;
      if (filename.indexOf ( 'file') > -1) {
         newPath = clean(document.location.pathname);
         rIndex = newPath.lastIndexOf ( '/' );
         newPath = newPath.substring (0,rIndex);
         filename = clean(filename);      
         //alert ( 'absolute path of current dir: ' + newPath)
         rIndex = filename.indexOf (newPath);
         //alert ( 'filename [' + filename + '], newPath is found in filename at:' + rIndex);
         newStart = rIndex + newPath.length + 1;
         //alert ( 'New start at: ' + newStart);
         newFilename = filename.substring (newStart); 
         // alert ( 'relativePath: filename: ' + filename + ',newPath: ' + newFilename );
      }
      return newFilename; 
   }
   

   
   function replaceAll(string, search, replace) {
      return string.split(search).join(replace);
   }
      
   function indexOf (array, target) { 
      for(var i = 0; i < array.length; i++) {
        if(array[i] === target) {
          return i;
        }
      }
      return -1; 
   }

   function inArray(array, target) {
      return (indexOf (array,target) > -1);
   }
   
   function readFile(filename){
      var f1;
      var text = '';
      if (fso.FileExists (filename)) {      
         f1 = fso.OpenTextFile(filename, 1);
         text = f1.ReadAll();
         f1.close();
      } else {
         alert ( filename + ' does not exist');
      }
      return text;
   }
   
   function writeFilename (filename, text) {
      Alert ( 'writeFilename (' + filename + ')' );
      var fso = new ActiveXObject("Scripting.FileSystemObject");
      var s = fso.CreateTextFile(filename, true);
      s.WriteLine (text);      
      s.Close();      
      Alert ( filename + ' written ');
   }   
   
   function readJson () {
      var text = readFile (jsonFilename);
      if (text == '') {
         text = "{\"photos\":{}, \"tags\":[], \"filters\":[] }";
      }
      return JSON.parse (text);       
   }
   
   function writeJson (filename, values) { 
      writeFilename   (filename, JSON.stringify(values));    
   }
   
   function addTagToPhoto(tagValue, filename) {
      var element = document.getElementById ( 'tags')
      var photoTags = json.photos[filename].tags;  
      if (inArray (photoTags,tagValue)) {
         alert ( tagValue + ' is already associated with: ' + filename );
      } else { 
         photoTags.push (tagValue);
         writeJson (jsonFilename, json);
      }
   }  

   function removeTagFromPhoto(tagValue, filename) {
      var element = document.getElementById ( 'tags')
      var photoTags = json.photos[filename].tags;  
      var index = indexOf (photoTags, tagValue);
      if (index > -1) {
         photoTags.splice(index, 1);
         writeJson (jsonFilename, json);
         alert ( tagValue + ' removed from ' + filename);
      } else {        
         alert ( tagValue + ' was not associated with: ' + filename );
      }
   }    

   

   
