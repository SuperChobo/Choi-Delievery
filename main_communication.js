socket.on('resCompanyList', function(data){
    companyList = data;
    loading = false;
    console.log(companyList);
    
    document.getElementById("tabtwoza").innerHTML = o_companyList();
})