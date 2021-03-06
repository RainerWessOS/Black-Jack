
   /*
     Black Jack - (17+4) 
     Copyright Rainer Wess 2018
     Made in Germany 🇩🇪
     
     Open Source / Freeware
     Released under GNU GPL 3.0
     You can download it from
     github, search RainerWessOS
   */

   globals: {

      var points_usr;
      var points_cpu;
      var sum_usr;
      var sum_cpu;
      var place_usr;
      var place_cpu;
      var running;
      var i;
      var ani;
      var intA;
      var intTC = [];
      var deck = [];
      var card = [];
      var card_value = [];
      var revcard;
      var nocard;
   }

for (i = 0; i <= 51; i++) {
   card[i] = new Image();
   card[i].src = "cards/card" + i + ".png";
}

revcard = new Image();
revcard.src = "cards/reverse.png";

nocard = new Image();
nocard.src = "cards/nocard.png";

card_value = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

function id(id) {
   return document.getElementById(id);
}

function setImg(pn, num) {

   id("place" + pn).src = card[num].src;
   id("place" + pn).style.boxShadow = "1px 1px 1px #303030";
}

function setText(sid, txt) {
   id(sid).innerHTML = txt;
}

function setColor(sid, color) {
   id(sid).style.color = color;
}

function aniWin() {

   ani = (ani) ? false : true;
   if (ani) setColor("info", "darkgreen");
   else setColor("info","gold");
}
 
   
  function showMenu() {
 id("menu").className="overlay_page";
 id("guide").className="hidden_page";
 id("about").className="hidden_page";
  }

  function showGuide() { 
id("guide").className="overlay_page";
id("menu").className="hidden_page";
  }

  function showAbout() {
id("about").className="overlay_page";
id("menu").className="hidden_page";
  }

 function showGame() {
  id("game").className="game_page";
  id("menu").className="hidden_page";
  
 }

function enableButtons() {

   id("takeBtn").disabled = false;
   id("standBtn").disabled = false;
}

function disableButtons() {

   id("takeBtn").disabled = true;
   id("standBtn").disabled = true;
   id("newBtn").disabled = true;
}

function init() {

   points_usr = 0;
   setText("points_usr", points_usr);
   points_cpu = 0;
   setText("points_cpu", points_cpu);
   newGame();
}

function createDeck() {

      var arr = [];
      for (var i = 0; i < 52; i++) {
         arr[i] = i;
      }
      
      return arr;
}


function shuffle(arr) {

   var i, j, tmp; 

   // Fisher-Yates Shuffling Algorithm

   for(i=arr.length-1; i>0; i--) {
    
      j = Math.floor(Math.random() * (i + 1));
      tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
      
   }
   
   return arr;
 }
 
 
 function takeCard() {
 
     var tc;
     
     if(deck.length == 0) {
       deck = createDeck();
       deck = shuffle(deck);     
     }
     
     tc = deck.pop();        
     
     
     return tc;
     
 }
    

function newGame() {

   sum_usr = 0;
   sum_cpu = 0;
   place_usr = 0;
   place_cpu = 5;
   ani = false;
   running = true;

   id("newBtn").blur();
   disableButtons();

   if (intA) clearInterval(intA);

   setText("busted", " ");
   setText("info", " ");
   setText("cpu", "0");
   setText("you", "0");
   setColor("info", "white");

   for (i = 0; i <= 9; i++) {
      id("place" + i).src = nocard.src;
      id("place" + i).style.boxShadow = "none";
   }

   setTimeout(showReversedCard, 500);
   setTimeout(cpuTakeCard, 1000);
   setTimeout(usrTakeCard, 1500);
   setTimeout(enableButtons, 1600);
}

function showReversedCard() {

   id("place6").src = revcard.src;
   id("place6").style.boxShadow = "1px 1px 1px #303030";
}

function usrTakeCard() {

   var cNum;

   id("takeBtn").blur();

   if (running) {
   
      if (sum_usr <= 21) {
         setText("info", " ");
         cNum = takeCard();
         setImg(place_usr, cNum);
         place_usr++;
         sum_usr += card_value[cNum % 13];
         setText("you", sum_usr);
      }
      
      if (sum_usr > 20) {
         disableButtons();
         whoWins();
      }
      // in rare cases five cards are not enough 
      // ToDo: shift the drawn cards in the places, if more cards needed then places available, but for now we reuse the last place
      if (place_usr > 4) place_usr--;
   }
}

function cpuTakeCard() {

   var cNum;

   if (running) {
   
      if ((sum_cpu < 19 && sum_cpu < sum_usr) || (sum_cpu < 16 && sum_cpu == sum_usr)) {

         cNum = takeCard();
         setImg(place_cpu, cNum);
         place_cpu++;
         sum_cpu += card_value[cNum % 13];
         setText("cpu", sum_cpu);
         
         if (place_cpu > 9) {

            // in rare cases five cards are not enough then the last place is reused
            place_cpu--;
            intTC[0] = setTimeout(cpuTakeCard, 1000);
         }
      }
      else whoWins();
   }
}

function stand() {

   // computers turn      
   var wait = 0;

   id("standBtn").blur();

   if (sum_usr > 9) {

      disableButtons();
      
      if (sum_cpu > sum_usr) whoWins();

      for (i = 0; i < 4; i++) {
      
         if (sum_usr > sum_cpu && sum_cpu < 19 || sum_usr == sum_cpu && sum_cpu < 16) {
            intTC[i] = setTimeout(cpuTakeCard, wait);
            wait += 1000;
         }
      }
   }      // Little Britain joke
   else setText("info", "💻 says NO!");
}

function youWin() {

   setColor("info", "gold");
   setText("info", "You Win!");
   intA = setInterval(aniWin, 700);
}

function youLose() {

   setText("info", "You Lose.");
}

function whoWins() {

   if (running) {
   
      if (sum_usr > 21 || (sum_cpu <= 21 && sum_cpu > sum_usr && sum_usr > 0)) {
      
         running = false;
         
         if (sum_usr > 21) {
            setText("info", "Busted");
            setTimeout(youLose, 800);
         }
         
         else youLose();
         points_cpu += 1;
         setText("points_cpu", points_cpu);
      }
      
      else if (sum_cpu > 21 || sum_usr == 21 || (sum_usr <= 21 && sum_usr > sum_cpu)) {
      
         running = false;
         
         if (sum_cpu > 21) {
            setText("busted", "* Busted *");
            setTimeout(youWin, 500);
         }
         else if (sum_usr == 21) {
            setTimeout(youWin, 500);
         }
         else youWin();
         points_usr += 1;
         setText("points_usr", points_usr);
      }
      else if (sum_cpu > 0 && sum_usr == sum_cpu) {
      
         running = false;
         
         setColor("info", "white")
         setText("info", "It's a tie!");
      }

      if (!running) {

         id("newBtn").disabled = false;

         for (i = 0; i < intTC.length; i++) {
            if (intTC[i]) clearTimeout(intTC[i]);
         }
      }
   }
}

// END
