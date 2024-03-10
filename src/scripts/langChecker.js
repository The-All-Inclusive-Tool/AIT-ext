
// import './main.css';

import { GoogleGenerativeAI } from "@google/generative-ai";


const ait = {

    shadowRoot: null,
    suggestionBox:null,

    createShadowRoot: ()=>{

        let sRoot = document.createElement('div')
        sRoot.className = 'ait_shadowRoot'
        // sRoot.style.position = 'relative'
        // sRoot.style.pointerEvents = 'none'
        sRoot.attachShadow({ mode: "open" })


        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        let cssURL = chrome.runtime.getURL('src/scripts/main.css')
        link.setAttribute('href', cssURL);
        sRoot.shadowRoot.appendChild(link);

        ait.shadowRoot = sRoot



        document.body.appendChild(sRoot)

        ait.createSuggestionBox()

        
    },
    createSuggestionButton: (inputElement)=>{
        ait.shadowRoot.shadowRoot.querySelectorAll('.ait_suggestionButton').forEach(ait_suggestionButton=>{
            ait.shadowRoot.shadowRoot.removeChild(ait_suggestionButton)

        })

        let rect = inputElement.getBoundingClientRect()

        let suggestionButton = document.createElement('button')
        suggestionButton.title = 'Check for Inclusive Language'
        suggestionButton.innerText = "Button"
        
        suggestionButton.style.position = 'absolute'
        suggestionButton.className = 'ait_suggestionButton'


        const x = rect.left + rect.width + window.scrollX - 50;
        const y = rect.top + rect.height + window.scrollY - 50;
        suggestionButton.style.left = `${x}px`;
        suggestionButton.style.top = `${y}px`;


        suggestionButton.addEventListener('click', (e)=>{

            ait.getSuggestion(inputElement.value, inputElement)


        })
        
        // document.body.appendChild(suggestionButton);
        ait.shadowRoot.shadowRoot.appendChild(suggestionButton);

        
    },

    // The Main Suggestion Box that gives the user an improved and more inclusive written text 
    createSuggestionBox: async ()=>{

        
        let suggestionBox = document.createElement('div')

        const suggestionBoxHTMLFileURL = chrome.runtime.getURL('src/scripts/suggestionBox.html');
        await fetch(suggestionBoxHTMLFileURL).then(response => response.text()).then(html => {
            suggestionBox.innerHTML += html
        });
        
        
        suggestionBox.className = "ait_suggestionBox"
        // suggestionBox.display = "none"
        
        
        
        ait.suggestionBox = suggestionBox
        ait.shadowRoot.shadowRoot.appendChild(suggestionBox)
        
    },
    
    getSuggestion: async (text, inputElement)=>{
        let suggestionBox = ait.suggestionBox

        let paraTag = suggestionBox.querySelector('.improvedTextPara')
        paraTag.innerText = text
        
        
        let rect = inputElement.getBoundingClientRect()
        const x = rect.left + rect.width + window.scrollX - 50;
        const y = rect.top + rect.height + window.scrollY - 50;
        ait.suggestionBox.style.left = `${x}px`;
        ait.suggestionBox.style.top = `${y}px`;


        suggestionBox.style.display = 'flex'

        
        // // Access your API key (see "Set up your API key" above)
        // const genAI = new GoogleGenerativeAI(API_KEY);

        // async function run() {
        //     // For text-only input, use the gemini-pro model
        //     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        //     const prompt = `Reply in the same format as the given text. Make this text inclusive for everyone, text: ${text}`; 
        //     const result = await model.generateContent(prompt);
        //     const response = await result.response;
        //     const text = response.text();
        //     console.log(text);
        // }
    },



    init: ()=>{
        console.log('Hare Krishn')

        ait.createShadowRoot()



        let allTextInputElements = document.querySelectorAll('input[type="text"], [contenteditable=true], textarea')
        allTextInputElements.forEach(inputElement => {
            inputElement.addEventListener('focus', (e)=>{
                console.log("Focused", e.target);

                ait.createSuggestionButton(e.target)
            })
        })

    }
}


ait.init()