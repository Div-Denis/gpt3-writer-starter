import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {
  //存储用户输入的状态
  const [userInput, setUserInput] = useState("");
  //输入的API
  const [apiOutput, setApiOutput] = useState("");
  //是否发生连接
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * 调用api
   */
  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch('./api/generate', {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({userInput}),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAi replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }

  /**
   * 获取输入框的信息，传进存储用户输入的状态变量里
   */
  const onUserChangeText = (event) => {
    // console.log(event.target.value);
    setUserInput(event.target.value);
  };


  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>MY GPT-3 Chat Rot 🤖</h1>
          </div>
          <div className="header-subtitle">
            <h2>Write your question here✍</h2>
          </div>
        </div>
        {/** 在此插入自己的代码*/}
        <div className='prompt-container'>
          <textarea placeholder='start typing here' className='prompt-box' value={userInput} onChange={onUserChangeText}/>
          <div className='prompt-buttons'>
             <a className={isGenerating ? 'generate-button loading' : 'generate-button'} onClick={callGenerateEndpoint}>
              <div className='generate'>
               {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
          </div>
          {apiOutput && (
            <div className='output'>
              <div className='output-header-container'>
                <div className='output-header'>
                  <h3>Output</h3>
                </div>
              </div>
              <div className='output-content'>
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
