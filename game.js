        weather = "Clear";
        var gold = 0;
        var workerCount = 0;
        var foodCount = 0;
        var farmerCount = 0;        
        var menCount = 10;
        var soldierCount =0;
        var traineeCount =0;
        var trainTime = 0;
        var starvation = false;
        var chanceOfStorms = 0;
        var totalMen = workerCount + farmerCount + menCount + soldierCount;
        var soldierNames = ["Akibrus", "Angun", "Balrus", "Bulruk", "Caldor", "Dagen",
         "Darvyn", "Delvin", "Dracyian", "Dray", "Eldar", "Engar", "Fabien", "Farkas",
          "Galdor", "Igor", "Jai-Blynn", "Klayden", "Laimus", "Malfas", "Norok", "Orion",
           "Pindious", "Quintus", "Rammir", "Remus", "Rorik", "Sabir ", "Séverin", "Sirius",
            "Soril", "Sulfu", "Syfas", "Viktas", "Vyn", "Wilkass", "Yagul", "Zakkas", "Zarek", 
            "Zorion"];
        currentInvaders = {"orcs": 0};
        
        soldierBag= [];

        var paused = false;

        var time = setInterval(updateTag, 1000/60);

        eventsArray= [];

        window.addEventListener("keypress", resolveKey);
        //maps each key to a corresponding function.
        function resolveKey() {
            switch (event.key) {
                case 'w': hireMan("worker"); break;
                case 'W': removeMan("worker"); break;
                case 'f': hireMan("farmer"); break;
                case 'F': removeMan("farmer"); break;
                case 'p': pauseToggle(); break;
                case 's': trainSoldier(); break;
                case '7': makeBuilding("Mill", true); break;
                case '8': makeBuilding("Watchtower", true); break;
                default: ;
            }
        }
        var ticks = 0;
        var invaderTick =0;
        var clockTicks = 0;
        var sixtyTicks = 0;
        var dayNumber = 1;
        var starvationCountdown = (60*5);
        timeOfDay = "Morning";
        function updateTag(){
            //check for events that end on the current tick and execute the
            //respective function.  
            for(i in eventsArray){
                if (ticks - eventsArray[i].eventTime >= 0) {
                    
                    eventsArray[i].func();
                    if ((eventsArray[i].recurring > 0)){
                        eventsArray[i].eventTime = (eventsArray[i].eventTime)+eventsArray[i].multiplier;
                        eventsArray[i].recurring--;
                        
                    }
                    else {
                        eventsArray.splice(i, 1);
                    }
                }
            }
 
            //reset building progress bar
            if(progress>maxProgress){
                
                progress = 0;
            }

            ticks++;
            sixtyTicks = Math.trunc(clockTicks/60);
            clockTicks++;
            //if blocks for time of day
            if(clockTicks < 300){
                timeOfDay = "Morning";
                weather = "Clear";
            }
            else if (clockTicks < 600) {
                if (clockTicks === 301) {
                    chanceOfStorms = Math.random();
                    if (chanceOfStorms > 0.8) {
                        weather = "Stormy";
                        eventLog("Wind's howling...");
                    }
                }
                timeOfDay = "Afternoon";
                
            }
            else if(clockTicks < 900){
                timeOfDay = "Evening";
            }
            else{
                clockTicks = 0;
                menCount++;
                dayNumber++;
            }
            if(foodCount <= 0 && (menCount + workerCount + farmerCount + soldierCount > 0)){
                
                starvationCountdown--;
                if(starvationCountdown<=0){
                    if (menCount > 0) menCount--;
                    else if (workerCount > 0) workerCount--;
                    else if (farmerCount > 0) farmerCount--;
                    else if (soldierCount > 0) {
                        
                        soldierBag[0].takeDamage(1000);
                    }
                    starvationCountdown = 60;
                }
            } 
            if(!starvation && foodCount <= 0){
                starvation = true;
                eventLog("No leader should let his people to starve to death...")
            }
            else if(starvation && foodCount > 0) starvation = false;
            if(currentInvaders.orcs > 0){
                if(invaderTick % 60 === 0){
                    currentWave = currentInvaders.orcs;
                    if(soldierCount <= 0){
                        if(menCount>0) menCount--;
                        else if(workerCount>0) workerCount--;
                        else if(farmerCount>0) farmerCount--;
                    }
                    while(currentWave > 0 && soldierCount >0){
                        for (i in soldierBag) {
                            if(currentWave >0 && soldierCount >0){
                                soldierBag[i].takeDamage(5);
                                currentWave--;
                            }
                        }
                    }
                    inflictDamage();
                }
                invaderTick++;
            }
            if(ticks % 60 === 0){//triggers events on the end of each second
    
                switch(timeOfDay){
                case "Morning": produceFood(), produceGold(); break;
                case "Afternoon": consumeFood(); break;
                case "Evening": ; break;
                default: ; break;
                }
                
            }
            if(currentInvaders.orcs <= 0){
                killThreshold =25;
                invaderTick = 0;
            }
            
            //for updating all HTML tags in real-time
            for(let i of soldierBag){
                info = i.soldierName+" ("+i.health+" HP)"
                    tagText(i.solId, info);
            }
            tagText("workers", workerCount);
            tagText("food", foodCount);
            tagText("farmers", farmerCount);
            tagText("men", menCount);
            tagText("soldiers", soldierCount);
            tagText("time", sixtyTicks);
            tagText("daynumber", dayNumber);
            tagText("timeofday", timeOfDay);
            tagText("weather", weather);
            tagText("gold", gold);
            document.getElementById("bar").value= progress;
            document.getElementById("bar2").value= progress2;


            if((menCount + workerCount + farmerCount + soldierCount) ===0){
                alert("GAME OVER.")
            }
        }
        
        //a class to manage soldier information
        solId = 1;
        class Soldier{
            constructor(){
                this.alive = true;
                const randomName = Math.floor(Math.random() * 40);
                this.soldierName = soldierNames[randomName];
                this.solId = solId;
                solId++; 
                this.health = 100;
            }
            //inflict damage on soldiers and check if they die, if so remove them
            takeDamage(value){
                this.health -= value;
                if(this.health <= 0){
                    this.alive = false;
                    for(i in soldierBag){
                        if(this.solId == soldierBag[i].solId){
                            document.getElementById(soldierBag[i].solId).remove();
                            soldierBag.splice(i, 1);
                            soldierCount--;
                        }
                        
                    }
                }
            }
            displayAndUpdate(){
            }
        }
        function waves(){
            var numberOfThem = 1;
            var timeForWatchtowerDetection = 14;
            
            timePlus(timeForWatchtowerDetection, () => {
                if(watchtowerExists) eventLog(numberOfThem + " orc(s) are approaching your camp!");
                timePlus(3, () => summonOrcs(numberOfThem, numberOfThem += 1));                
            }, 999999);
            
        }
        waves();
        eventLog("Only soldiers are worthy of having names...");
        //function for adding text to the eventlog in the game
        function eventLog(newText){
            
            const li = document.createElement("li");
            const textNode = document.createTextNode(newText);
            li.appendChild(textNode);
            
            ul = document.getElementById("eventlog");
            ul.appendChild(li);
            updateScroll();
        }
        function summonOrcs(number){
            eventLog(number+ " orcs have invaded your keep!");
            currentInvaders.orcs += number;
        }
        //update innerHtml values
        function tagText(id, inner){
            document.getElementById(id).innerHTML = inner;
        }
        //for creating timed events that execute a function after a certain time
        //can also call the function repeatedly until timeInSeconds is finished
        function timePlus(timeInSeconds, func, recurring=0){
                timeInTicks = timeInSeconds*60;
                eventTime = ticks + timeInTicks;
                multiplier = timeInTicks;
                let timedEvent = {
                    eventTime,
                    func,
                    recurring,
                    multiplier
                }
                eventsArray.push(timedEvent);
        }
        killThreshold = 25;
        function inflictDamage(){
            totalDamage = soldierCount * 5;
            killThreshold -= totalDamage;
            if(killThreshold === 0){
                currentInvaders.orcs--;
                eventLog("An orc has been killed! " + currentInvaders.orcs + " orc(s) left.");
                killThreshold = 25;
            }
            while(killThreshold < 0){
                if(currentInvaders.orcs > 0){
                    killThreshold = 25 + killThreshold;
                    if(killThreshold <= 0){
                        currentInvaders.orcs--;
                    }
                }
            }
        }

        function updateScroll() {
                var element = document.getElementById("info");
                element.scrollTop = element.scrollHeight;
            }
        //variable for max value of progress bar with a funcion that activates the progress bar animation
        maxProgress = 10;
        maxProgress2 = 2;
        progress = 0;
        progress2 = 0;
        document.getElementById("bar2").max = maxProgress2;
        document.getElementById("bar").max = maxProgress;
        function activateBar(){   
                progress++;
        }
        function activateBar2(){   
                progress2++;
        }
        //pauses the game and displays an alert box
        function pauseToggle(){
                paused = true; 
                clearInterval(time);
                alert('Game Paused');
                paused = false;
                time = setInterval(updateTag, 1000/60);
        }
        //for creating html elements
        function createItem(place, element, text, id){
            temp = document.createElement(element);
            temp.id= id;
            textNode = document.createTextNode(text);
            temp.appendChild(textNode);
            thePlace = document.getElementById(place);
            thePlace.appendChild(temp);
        }
        //adds building functionality and adds text to the buildings section (first column from the right)
        buildingInProgress = false;
        millExists = false;
        watchtowerExists = false;
        function makeBuilding(name, tbc=false){
            if(!tbc){
                createItem("buildings", "li", name);
            }
            else if(!buildingInProgress){
                if(name === "Mill" && !millExists && gold >= 50){
                    gold -= 50;
                    buildingInProgress = true;
                    document.getElementById("bar").style.visibility= "visible";
                    createItem("buildingsTBC", "li", "Mill", 7);
                    timePlus(1, activateBar, 10);
                    timePlus(11, () => {
                        millExists = true;
                        buildingInProgress = false;
                        makeBuilding("Mill");
                        document.getElementById(7).remove();
                        document.getElementById("bar").style.visibility= "hidden";
                    })
                }
                else if(name === "Watchtower" && !watchtowerExists && gold >= 1000){
                    gold -= 1000;
                    buildingInProgress = true;
                    document.getElementById("bar").style.visibility= "visible";
                    createItem("buildingsTBC", "li", "Watchtower", 8);
                    timePlus(1, activateBar, 10);
                    timePlus(11, () => {
                        watchtowerExists = true;
                        buildingInProgress = false;
                        makeBuilding("Watchtower");
                        document.getElementById(8).remove();
                        document.getElementById("bar").style.visibility= "hidden";
                    })
                }
            }
        } 
        

        // function updateS(){
        //     for(let i = solId;i > 0;i--){
        //         if(i ==2){
        //             sName = "s" + i;
        //             tagText(i, (" ("+sName.health+" HP)"));
        //         }
        //     }
        // }

        
        function trainSoldier(){
            if (menCount > 0 && traineeCount === 0) {
                traineeCount++;
                menCount--;
                sName = "s" + solId;
                document.getElementById("bar2").style.visibility= "visible";
                createItem("unitsTBC", "div", "Soldier "+ solId, "sol"); 

                timePlus(1, activateBar2, 2);
                timePlus(3, () => {
                    soldierCount++;
                    traineeCount = 0;
                    progress2 = 0;
                    document.getElementById("sol").remove();
                    createItem("slist", "div", "Soldier "+ solId, solId);
                    
                    sName = new Soldier;
                    soldierBag.push(sName);
                    document.getElementById("bar2").style.visibility= "hidden";
                })
            }
        }
        //for assigning occupations
        function hireMan(occupation){
            if (menCount > 0){
            switch(occupation){
                case "worker": workerCount++; break;
                case "farmer": farmerCount++; break;
                case "worker": workerCount++; break;
                default: ;
            }
            menCount--;
            }
        }
        //function for removing men; adding them to "available men"
        function removeMan(occupation){
            if(occupation ==="farmer" && farmerCount > 0){
                farmerCount--;
                menCount++;
            }
            else if(occupation ==="worker" && workerCount > 0){
                workerCount--;
                menCount++;
            }
            else if(occupation ==="soldier" && soldierCount > 0){
                soldierCount--;
                menCount++;
            }
            
            
        }
        function produceGold(){
            gold = gold + (workerCount*2);
        }
        function buy(price){
            if(price <= gold){
                gold -= price;
                return true;
            }
            else return false;
        }
        //produces food each time its called
        function produceFood(){
            if(weather == "Stormy")foodCount = foodCount + farmerCount;
            else foodCount = foodCount + farmerCount*2;

            if(millExists){
                foodCount += farmerCount;
            }
        }
   
        //subtract food based on all active men
        function consumeFood(){
            foodCount = foodCount - (menCount + workerCount + farmerCount + soldierCount);
            if (foodCount < 0){
                foodCount = 0;
            }
        }