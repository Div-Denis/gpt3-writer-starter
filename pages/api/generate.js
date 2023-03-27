import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//第一个提示
const basePromptPrefix = 
             `
               Write me a detailed table of contents for a blog with the title below.

               Title:
             `;

const generateAction = async (req, res) => {
    //运行第一个提示
    console.log(`API:${basePromptPrefix}${req.body.userInput}`);
     
    const baseCompletion = await openai.createCompletion({
        model: 'text-davinci-003', //我们要使用的模型类型
        prompt: `${basePromptPrefix}${req.body.userInput}`, //这是我们传递的提示符，在这里情况下，我们传递给它现在是一个空字符串的basePromptPrefix和req.body.userInput.它将是用户在前端的textarea中输入的输入我们发生给这个API函数。
        temperature: 0.7, 
        max_tokens: 250, //我现在将其设置为250，总共大约1000个字符串。
    });
    
    //获取输出
    const basePromptOutput = baseCompletion.data.choices.pop();

    //第二个提示
    const secondPrompt = 
      `
         Take the table of contents and title of the blog post below post below and generate a blog post written in thwe style of Paul Graham. Make it feel like a story. Don't just list the point. Go deep into each one. Explain why. 

         Title: ${req.body.userInput}

         table of Contents: ${basePromptOutput.text}

         Blog Post:
      `;

      //用Prompt第二次调用OpenAi API
      const secondPromptCompletion = await openai.createCompletion({
        model : 'text-davinci-003',
        prompt:`${secondPrompt}`,
        temperature: 0.85,//设置更高的温度
        max_tokens: 1250,//设置更多的文字
      });

      const secondPromptOutput = secondPromptCompletion.data.choices.pop();

    //将提示#2的输出发送到我们的UI，而不是第一个提示
    res.status(200).json({output: secondPromptOutput});
}

export default generateAction;