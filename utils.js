var parser = require('fast-xml-parser');
var he = require('he');

var fs = require('fs');
var iconvLite = require('iconv-lite');

function openXML(fullPath) {
    let xmlString = fs.readFileSync(fullPath, "utf8");
    return xmlString;
}

function xmlParseJson(xmlString) {
    // xml을 열고 출력하는 부분
    const options = {
        attributeNamePrefix : "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : true,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"]
    };

    if(parser.validate(xmlString) === true) {
        console.log("it was validated xml data!");
        let jsonObj = parser.parse(xmlString, options);

        let json = JSON.stringify(jsonObj);
        return jsonObj;
    }
    return null;
}

function XML2JSON(fullPath) {
    let jsonData = xmlParseJson(openXML(fullPath));
    if (jsonData == null) {
        // 경고 데이터 추가하기
        return null;
    } else {
        return jsonData;
    }

}

function getFileInformation(fullPath) {
    // 파일 이름 분류, 여기서 예외 처리 1차 작업 필요함.
    const splittedFilePath = filePath.split("/");
    const fileNameWithExtension = splittedFilePath[splittedFilePath.length - 1];

    const splittedFileName = fileNameWithExtension.split(".");

    const fileName = splittedFileName[0];
    const fileExtension = splittedFileName[1];

    return {
        fullPath: fullPath,
        fileName: fileName,
        fileExtension: fileExtension,
        saveFileName: `${fileName}.ccs`,
    };
}


module.exports.XML2JSON = XML2JSON;

module.exports.getDownloadFilename = function(req, filename) {
    const header = req.headers['user-agent'];

    if (header.includes("MSIE") || header.includes("Trident")) {
        return encodeURIComponent(filename).replace(/\\+/gi, "%20");
    } else if (header.includes("Chrome")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Opera")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    } else if (header.includes("Firefox")) {
        return iconvLite.decode(iconvLite.encode(filename, "UTF-8"), 'ISO-8859-1');
    }

    return filename;
};

