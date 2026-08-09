import {useState} from 'react'
import words from "./wordList.json"
import HangmanDrawing from "./HangmanDrawing"
import {Keyboard} from "./keyboard"
import {HangmanWord} from "./HangmanWord"
// we need to track the letter we have 
function App(){
    const [wordToGuess, setWordToGuess]=useState(()=>{
        return words[Math.floor(Math.random()*words.length)]
    })
    // we need to track the letter we have guessed and store it in an array
    const [guessLetters, setguessedLetters]=useState<string[]>([])
    console.log(wordToGuess)
    return(<div style={{
        maxWidth:"800px",
        display:"flex",
        flexDirection:"column",
        gap:"2rem",
        margin:"0 auto",
        alignItems:"center"
    }}

    >
        <div style={{
            fontSize:"2rem",
            textAlign:"center"
        }}>Lose Win </div>
        <HangmanDrawing/>
        <HangmanWord/>
        <div style ={{alignSelf:"stretch"}}>
            <Keyboard/>
        </div>
        
    </div>)
}
export default App