socket.on('resCompanyList', function(data){
    companyList = data;
    loading_companyList = false;
    console.log("companyList : ",companyList);
})

socket.on('resEncounterList', function(data){
    encounterList = data;
    loading_encounterList = false;
    console.log("encounterList : ", encounterList);
})

socket.on('resCateList', function(data){
    cateList = data;
    loading_cateList = false;
    console.log("CateList : ", cateList);
})