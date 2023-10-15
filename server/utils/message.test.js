const expect = require("expect");
const {generateMessage} = require("./message")

describe("Generate Message",()=>{
    it("should generate correct message object",()=>{
        let from = "Ishu";
        let text = "Some random text";
        let message = generateMessage(from , text);

    // expect(typeofmessage.createdAt).toBe("number");
    expect(()=>{
        message
    }).toMatchObject({from,text});
    });
});