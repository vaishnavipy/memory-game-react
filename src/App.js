
import { useEffect, useState } from 'react';
import lodash, { cond } from "lodash"
import './App.css';
import question from "./question.png"

function App() {
 
  const [cardsArr,setCardsArr] = useState(Array(12).fill({src:question,name:"question"}))
 

  const pokemon = [
    { id: 4, name: 'charizard' },
    { id: 10, name: 'caterpie' },
    { id: 77, name: 'ponyta' },
    { id: 108, name: 'lickitung' },
    { id: 132, name: 'ditto' },
    { id: 133, name: 'eevee' },
  ];


//Shuffles every time the page is refreshed
  const [pokemonArr,setPokemonArr] = useState(lodash.shuffle([...pokemon,...pokemon]))

  const [pokemonImgArr,setPokemonImgArr] = useState([])


  //On component mount, fetch image as blob and store it in an array
  useEffect(()=>{
    pokemonArr.forEach((elm,index) => {
      fetch(`https://pokeres.bastionbot.org/images/pokemon/${elm.id}.png`)
      .then(response => response.blob())
      .then(image =>  setPokemonImgArr(prevArr => [...prevArr,{src:URL.createObjectURL(image),name:elm.name}]))

    })
  },[])

 
   
 
 const [pokemonPair,setPokemonPair] = useState([])

  const [moves,setMoves] = useState(0)

 const cards = cardsArr.map((item,i) => <div onClick={handleClick} key={i} id={i} className="card" ><img src={item.src} className="img" id={i}/></div>)
 
 const cardsDiv = document.querySelectorAll(".card")

  

  function handleClick(event){
   if(event.target.id !== "game-grid"  ){
  
     event.currentTarget.classList.add("rotate")
     const id = event.target.id
console.log(cardsArr,id)
     if(cardsArr[id].name !== pokemonImgArr[id].name ){
     const tempArr = [...cardsArr] // Make sure to use array literal to assign the array as an copy
     tempArr[id] = {...pokemonImgArr[id]}; // Make sure to use only object literal to not modify the original object
   
     setCardsArr(tempArr)
     setMoves(prevMove => prevMove+1)
     setTimeout(()=>{
      setPokemonPair(prevState => [...prevState,{name: pokemonImgArr[id].name, id : id}])
      console.log(pokemonPair)
     },700)
     }
   }
  }


  //Make a check after every two cards have been opened 
  useEffect(()=>{
   
    if(pokemonPair.length ==2){
      if(pokemonPair[0].name !== pokemonPair[1].name){
        const tempArr = cardsArr.map(item => {
          if(item.name == pokemonPair[0].name || item.name == pokemonPair[1].name){
         
            return {src:question,name:"question"}
          }else{
            return item
          }
        })
        cardsDiv.forEach(elm => {
          console.log(elm,"elm")
          if(elm.id == pokemonPair[0].id || elm.id == pokemonPair[1].id ){
            
          elm.classList.remove("rotate")  
          }
        })
        setCardsArr(tempArr)

      }
      setPokemonPair([])
    }
    checkforWin()
  },[pokemonPair])
  
  function checkforWin(){

    const finalArr = cardsArr.filter(elm => elm.name != "question")

    if(finalArr.length == 12){
      alert("Congrats !, You've won")
      cardsDiv.forEach(elm =>  elm.classList.remove("rotate"))
      setCardsArr(Array(12).fill({src:question,name:"question"}))
      
      setMoves(0)
    }

  }  

  return (
    <div className="main-container">
        <p className="moves">{moves} moves</p>
        <div className="game-grid"   id="game-grid">
          {cards}
        </div>
    </div>
  );
}

export default App;
