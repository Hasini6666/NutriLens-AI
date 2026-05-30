function previewImage(event){

    let preview =
        document.getElementById("preview");

    preview.src =
        URL.createObjectURL(event.target.files[0]);

    preview.style.display = "block";
}

async function scanImage(){

    let image =
        document.getElementById("imageInput")
        .files[0];

    if(!image){
        alert("Upload a food packet image");
        return;
    }

    document.getElementById(
        "ingredientInput"
    ).value = "Scanning image...";

    const result =
        await Tesseract.recognize(
            image,
            "eng"
        );

    let text =
        result.data.text.toLowerCase();

    text = text
        .replace(/sugor/g,"sugar")
        .replace(/polm oil/g,"palm oil")
        .replace(/sodiun/g,"sodium")
        .replace(/\n/g,", ");

    document.getElementById(
        "ingredientInput"
    ).value = text;
}

function analyzeIngredients(){

    let ingredients =
        document.getElementById(
            "ingredientInput"
        ).value.toLowerCase();

    let issues = [];
    let score = 10;

    function addIssue(msg, minus){
        issues.push(msg);
        score -= minus;
    }

    if(
        ingredients.includes("sugar") ||
        ingredients.includes("glucose") ||
        ingredients.includes("corn syrup")
    ){
        addIssue("High Sugar Content",2);
    }

    if(
        ingredients.includes("salt") ||
        ingredients.includes("sodium") ||
        ingredients.includes("msg")
    ){
        addIssue("High Sodium Content",2);
    }

    if(
        ingredients.includes("sodium benzoate") ||
        ingredients.includes("preservative") ||
        ingredients.includes("ins 211")
    ){
        addIssue(
            "Contains Preservatives",
            2
        );
    }

    if(
        ingredients.includes("palm oil") ||
        ingredients.includes("trans fat")
    ){
        addIssue(
            "High Saturated Fat",
            2
        );
    }

    if(
        ingredients.includes("e102") ||
        ingredients.includes(
            "artificial color"
        )
    ){
        addIssue(
            "Artificial Colors Added",
            1
        );
    }

    if(score < 1){
        score = 1;
    }

    let status = "";

    if(score >= 8){
        status = "Healthy";
    }
    else if(score >= 5){
        status = "Moderate";
    }
    else{
        status = "Harmful";
    }

    document.getElementById(
        "score"
    ).innerText = score;

    let statusElement =
        document.getElementById(
            "status"
        );

    statusElement.innerText =
        status;

    let meterBar =
        document.getElementById(
            "meterBar"
        );

    meterBar.style.width =
        score * 10 + "%";

    if(status === "Healthy"){
        statusElement.style.color =
            "green";

        meterBar.style.background =
            "green";
    }
    else if(status === "Moderate"){
        statusElement.style.color =
            "orange";

        meterBar.style.background =
            "orange";
    }
    else{
        statusElement.style.color =
            "red";

        meterBar.style.background =
            "red";
    }

    let issueList =
        document.getElementById(
            "issues"
        );

    issueList.innerHTML = "";

    if(issues.length === 0){
        issues.push(
            "No major harmful ingredients found"
        );
    }

    issues.forEach(issue=>{

        let li =
            document.createElement(
                "li"
            );

        li.innerText =
            "⚠️ " + issue;

        issueList.appendChild(li);
    });

    let recommendation="";

    if(score >= 8){
        recommendation =
            "Safe for regular consumption.";
    }
    else if(score >= 5){
        recommendation =
            "Consume occasionally.";
    }
    else{
        recommendation =
            "Avoid frequent consumption.";
    }

    document.getElementById(
        "recommendation"
    ).innerText =
        recommendation;
}