var initialMcap = undefined
var ATH = 0
var nextbValue = 10000
var curMcap = 5000

var tokenCa = '8qaEbcErZRcPB6gtYpbF9Sv9iJWthCBrs4K8xjNqpump'

if(tokenCa == ''){
    caLabel.textContent('Launching now, site will be functional shortly')
}else{
    caLabel = document.getElementById('CA')
    caLabel.textContent = `CA: ${tokenCa}`
}

async function handleMcap(){
    const athText = document.getElementById('curath')
    const cityBuilder = new CityBuilder();
    const nextBuilding = document.getElementById('nextbuilding')

    
    var lastMcap = undefined
    
    

    const apikey = "67a83324-889c-48ec-82a0-9533de1a939d"

const holderCount = document.getElementById('holders-count')

const url = `https://data.solanatracker.io/tokens/${tokenCa}`
        console.log(tokenCa)

        const headers = {
            "x-api-key": '67a83324-889c-48ec-82a0-9533de1a939d'
        }

        try{
            const response = await fetch(url, {
                method: 'GET', headers: headers
            })

            const data = await response.json()
            curMcap = Math.round(data.pools[0].marketCap.usd)
            holderCount.textContent = `${curMcap}`
            if(curMcap == 0 || curMcap == undefined){
                holderCount.textContent = 'Pool Migrating...'
            }

            if(curMcap > ATH){
                ATH = curMcap
            }

            if(curMcap > nextbValue){
                var addCounter = (curMcap - nextbValue) / 5000
                for(let i = 0; i <= addCounter; i++){
                    cityBuilder.createBuilding();
                }
                nextbValue = ATH + 5000
            }



           
            athText.textContent = ATH
            holderCount.textContent = curMcap
            nextBuilding.textContent = `${nextbValue}`
            cityBuilder.updateProgress(curMcap)
            lastMcap = curMcap
            console.log(curMcap)
            if(curMcap == 0 || curMcap == undefined){
                holderCount.textContent = 'Pool Migrating...'
            }
        } catch (error){
           
            console.log()
            cityBuilder.updateProgress(curMcap)
            
        }
        

}

setInterval(handleMcap, 2000)



class CityBuilder {
    constructor() {
        this.holders = 0;
        this.maxHolders = 100;
        this.cityContainer = document.getElementById('city-container');
        this.holdersElement = document.getElementById('holders-count');
        this.titleElement = document.getElementById('title');
        this.progressFill = document.querySelector('.progress-fill');
        this.buildingTypes = [
            { minHeight: 100, maxHeight: 180, width: 40, style: 'classic', features: ['windows'] },
            { minHeight: 150, maxHeight: 250, width: 45, style: 'modern', features: ['cone-top'] },
            { minHeight: 200, maxHeight: 300, width: 50, style: 'glass', features: ['crown'] },
            { minHeight: 120, maxHeight: 220, width: 35, style: 'classic', features: ['dome'] },
            { minHeight: 180, maxHeight: 280, width: 42, style: 'modern', features: ['cone-top', 'windows'] },
            { minHeight: 160, maxHeight: 260, width: 38, style: 'glass', features: ['windows'] },
            { minHeight: 140, maxHeight: 260, width: 44, style: 'classic', features: ['cone-top'] }
        ];
        this.positions = Array.from({ length: 35 }, (_, i) => i * 30).sort(() => Math.random() - 0.5);
        this.currentPositionIndex = 0;
    }

    updateProgress(mcap) {
        const progress = (mcap / 1000000) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    updateCounter() {
        this.holders++;
        this.holdersElement.textContent = this.holders;
        this.updateProgress();
    }

    addWindows(building, height) {
        const windowsContainer = document.createElement('div');
        windowsContainer.className = 'windows';
        
        const rows = Math.max(5, Math.floor(height / 25));
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'window-row';
            
            const windowCount = Math.floor(Math.random() * 2) + 2;
            for (let j = 0; j < windowCount; j++) {
                const window = document.createElement('div');
                window.className = 'window';
                row.appendChild(window);
            }
            
            windowsContainer.appendChild(row);
        }
        
        building.appendChild(windowsContainer);
    }

    addBuildingFeatures(building, features, height) {
        features.forEach(feature => {
            switch (feature) {
                case 'windows':
                    this.addWindows(building, height);
                    break;
                case 'cone-top':
                    const cone = document.createElement('div');
                    cone.className = 'cone-top';
                    building.appendChild(cone);
                    break;
                case 'dome':
                    const dome = document.createElement('div');
                    dome.className = 'dome';
                    building.appendChild(dome);
                    break;
                case 'crown':
                    const crown = document.createElement('div');
                    crown.className = 'crown';
                    building.appendChild(crown);
                    break;
            }
        });

        if (Math.random() > 0.8) {
            const tree = document.createElement('div');
            tree.className = 'tree';
            tree.style.left = `${Math.random() * 20 - 15}px`;
            building.appendChild(tree);
        }
    }

    createBuilding() {
        if (this.holders >= this.maxHolders) return;

        const buildingType = this.buildingTypes[Math.floor(Math.random() * this.buildingTypes.length)];
        const height = Math.random() * (buildingType.maxHeight - buildingType.minHeight) + buildingType.minHeight;
        
        const building = document.createElement('div');
        building.className = `building ${buildingType.style}`;
        building.style.width = `${buildingType.width}px`;
        building.style.height = '0px';
        
        const position = this.positions[this.currentPositionIndex];
        this.currentPositionIndex = (this.currentPositionIndex + 1) % this.positions.length;
        
        const offset = Math.random() * 8 - 4;
        building.style.marginLeft = `${offset}px`;
        building.style.order = position;

        this.cityContainer.appendChild(building);
        
        building.offsetHeight;
        building.style.height = `${height}px`;
        
        this.addBuildingFeatures(building, buildingType.features, height);
    }

}

window.onload = () => {
    const cityBuilder = new CityBuilder();
    cityBuilder.start();
};
