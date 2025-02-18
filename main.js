database = firebase.database()
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    console.log(name + "=" + (value || "")  + expires + "; path=/")
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function getCurrentDateTime() {
    const now = new Date();
  
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
  
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
function getCurrentTime() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');  // Get hours and pad with leading zero if necessary
    const minutes = String(now.getMinutes()).padStart(2, '0');  // Get minutes and pad with leading zero if necessary
    const seconds = String(now.getSeconds()).padStart(2, '0');  // Get seconds and pad with leading zero if necessary
  
    return `${hours}:${minutes}:${seconds}`;  // Return time in hh:mm:ss format
}
if(getCookie('old') == null){
    setCookie('old', 1, 365);
    alert('Welcome to Dream Catcher!!!\nYou can access your account by entering your password and create a new account simply by entering a new password.\n You can record your dreams here under specific categories.')
}
pass = prompt("Create new password/Enter Your password")
// pass = 'Shresth'
if(pass != null){

    checkpass = database.ref('/'+pass).once("value",function(data){
        password = data.val()
        if(password == null){
            a = confirm('Account does not exist, Do you want to create new?')
            if(a){
                
                database.ref('/'+pass).update({
                exist:1,
                lastAccess:getCurrentDateTime()
                });
                database.ref('/'+pass+'/categories').update({
                    default:1
                })
                console.log(a)
            }
        }
        else{
            database.ref('/'+pass).update({
                lastAccess:getCurrentDateTime()
            });
        }
        main()
    });
}
else{
    document.getElementById('read').style.display = 'none';
    document.getElementById('write').style.display = 'none';
}

document.getElementById('readbt').addEventListener('click', ()=>{
    document.getElementById('read').style.display = 'block';
    document.getElementById('write').style.display = 'none';
})
document.getElementById('writebt').addEventListener('click', ()=>{
    document.getElementById('read').style.display = 'none';
    document.getElementById('write').style.display = 'block';
})
document.getElementById('createcategory').addEventListener('click', ()=>{
    name1 = prompt('Enter name')
    database.ref('/' + pass + '/categories/' + name1).update(({
        exist:1
    }))
    const dropdown = document.getElementById("writecategory");
    const option = document.createElement("option");
    option.value = name1; // You can use the key as the option value
    option.textContent = name1; // Use the text as the option text
    dropdown.appendChild(option);
})
function createContentTile(date, category, content) {
    // Create the main div element
    const contentTile = document.createElement('div');
    contentTile.classList.add('readcontenttile'); // Add the 'readcontenttile' class to it
    
    // Create the h2 element (Date)
    const h2 = document.createElement('h2');
    h2.textContent = date + '......'+category; // Set the date text passed as argument
    
    // Create the h3 element (Category)
    // const h3 = document.createElement('h3');
    // h3.textContent = category; // Set the category text passed as argument
    
    // Create the p element (Content Paragraph)
    const p = document.createElement('p');
    p.classList.add('contentpara'); // Add the 'contentpara' class
    
    // Set the content of the paragraph passed as argument
    p.textContent = content;
    
    // Append the h2, h3, and p elements to the main div (contentTile)
    contentTile.appendChild(h2);
    // contentTile.appendChild(h3);
    contentTile.appendChild(p);
    
    // Find the big div (parent div) where this content should go
    const bigDiv = document.getElementById('readcontent'); // Replace 'bigDiv' with the actual id of the parent div
    
    // Append the created contentTile div inside the big div
    bigDiv.appendChild(contentTile);
  }
  
  // Example usage of the function
//   createContentTile('2025-02-20', 'category', 'daklsfj kla;fjkadsjf ;ejklasdjf kjafkasdj fljekl jaf;ie ma;lkdjf;iae ja;kldj foawjlajkdfaei ajskdfjawo jfklasdj fawei fjasfei jal;fjae;li jfa;sdkjf afj asd;fjaei jadf;jaasd fjk;aejf adjf; jaeijf kjkdjf;a kad;j fjkadsjfad fj;kad fjae');
  
function main(){
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('writedate').value = formattedDate;
    database.ref('/'+pass+'/categories').once("value",function(data){
        categories = data.val()
        console.log(categories)
        const dropdown = document.getElementById("writecategory");
        const dropdown1 = document.getElementById("readcategory");
        for (let key in categories) {
            if (categories.hasOwnProperty(key)) {
            // Create a new option element
            const option = document.createElement("option");
            option.value = key; // You can use the key as the option value
            option.textContent = key; // Use the text as the option text
            const option1 = document.createElement("option");
            option1.value = key; // You can use the key as the option value
            option1.textContent = key; // Use the text as the option text
            dropdown.appendChild(option);
            dropdown1.appendChild(option1);
            }
        }
        document.getElementById('fetch').addEventListener('click', ()=>{
            date = document.getElementById('readdate').value.toString();
            if(date == ''){
                console.log('no date')
                document.getElementById('readcontent').innerHTML = '';
                categoryselected = document.getElementById('readcategory').value;
                database.ref('/'+pass+'/data').once("value", function(data){
                    data1 = data.val()
                    console.log(data1)
                    for(i in data1){
                        if(data1[i]['category']==categoryselected){
                            createContentTile(i, data1[i]['category'], data1[i]['text'])
                        }
                    }
                })
            }
            else{
                document.getElementById('readcontent').innerHTML = '';
                database.ref('/'+pass+'/data/'+date).once("value",function(data){
                    console.log(date)
                    data1 = data.val()
                    console.log(data1)
                    createContentTile(date, data1['category'], data1['text'])
                })
            }
        })
        document.getElementById('writesubmit').addEventListener('click', ()=>{
            textdata = document.getElementById('writetext').value;
            console.log(textdata)
            date = document.getElementById('writedate').value.toString();
            console.log(date)
            categoryselected = document.getElementById('writecategory').value;
            console.log(categoryselected)
            // database.ref('/'+pass+'/data/'+date+'/'+getCurrentTime().toString()).update({
            database.ref('/'+pass+'/data/'+date).update({
                category:categoryselected, 
                text:textdata
            })
            alert('Data recorded for ' + date + ' under the category ' + categoryselected)
        })
    })
}