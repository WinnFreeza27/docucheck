import './style.css'
import Phaser, { Physics, Scene } from 'phaser'
const sizes = {
  width: 700,
  height: 700
}
import { personData as nameData } from './person_data'
import { nationalityData } from './nationality_data'


class HomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  } 

  preload() {
    this.load.image('bg', 'assets/main_background.png')
    this.load.image('homeMenu', 'assets/home_menu.png')
    this.load.image('startButton', 'assets/button_play.png')
    this.mute = false
  }
  

  create() {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0);
    const homeMenu = this.add.image(sizes.width / 2 - 135, sizes.height / 2 - 100, 'homeMenu').setOrigin(0);
    const startButton = this.add.image(sizes.width / 2 - 60, sizes.height / 2 + 10, 'startButton').setOrigin(0);
  
    // Add interactivity for start button
    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerdown', () => {
      console.log('Start button clicked');
      this.tweens.add({
        targets: startButton,
        scale: 0.9, // Shrink slightly
        duration: 100,
        yoyo: true, // Return to original scale
        ease: 'Power1',
      });
      this.scene.start('MainScene'); // Uncomment to start the next scene
    });
  
    bg.setScale(sizes.width / bg.width, sizes.height / bg.height);
  }
  
  updateSound() {
    // Toggle mute state
    this.mute = !this.mute;
  
    // Update button texture
    this.soundButton.setTexture(this.mute ? 'muteButton' : 'unmuteButton');
  
    console.log('Mute state:', this.mute ? 'Muted' : 'Unmuted'); // Debugging feedback
  }
  
}

class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  init(data) {
    this.score = Math.floor(data.score / 2) 
    console.log(data.score)
  }

  preload() {
    this.load.image('bg', 'assets/main_background.png');
    this.load.image('container', 'assets/container_big.png');
    this.load.image('star_filled', 'assets/star_filled.png');
    this.load.image('star_empty', 'assets/star_empty.png');
    this.load.image('playAgainButton', 'assets/button_play_again.png');
  }

  create() {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0);
    bg.setScale(sizes.width / bg.width, sizes.height / bg.height);
  
    const container = this.add.image(120, sizes.height / 2 - 100, 'container').setOrigin(0);
  
    // Button with hover and click effects
    const playAgainButton = this.add
      .image(250, 450, 'playAgainButton')
      .setOrigin(0)
      .setInteractive({ useHandCursor: true });
  
    // Hover Effect
    playAgainButton.on('pointerover', () => {
      this.tweens.add({
        targets: playAgainButton,
        scale: 1.01, // Slightly enlarge
        duration: 200,
        ease: 'Power1',
      });
    });
  
    playAgainButton.on('pointerout', () => {
      this.tweens.add({
        targets: playAgainButton,
        scale: 1, // Reset to original size
        duration: 200,
        ease: 'Power1',
      });
    });
  
    // Click Effect
    playAgainButton.on('pointerdown', () => {
      this.tweens.add({
        targets: playAgainButton,
        scale: 0.9, // Slightly shrink on click
        duration: 100,
        ease: 'Power1',
        yoyo: true, // Bring back to original size
      });
    });
  
    // Button click action
    playAgainButton.on('pointerup', () => {
      console.log('Play Again clicked!');
      // Add scene transition or any action here
      this.scene.start('MainScene'); // Example transition
    });
  
    // Dynamic Star Rendering with Animation
    const starPositions = [180, 300, 420]; // x positions for the stars
    const yPosition = 300; // y position for all stars
    const starGroup = [];
  
    for (let i = 0; i < 3; i++) {
      const texture = i < this.score ? 'star_filled' : 'star_empty';
      const star = this.add.image(starPositions[i], yPosition, texture).setOrigin(0).setScale(0); // Start scaled down
      starGroup.push(star);
    }
  
    // Animate stars one by one
    starGroup.forEach((star, index) => {
      this.tweens.add({
        targets: star,
        scale: 1, // Scale up to full size
        duration: 500, // Animation duration
        delay: index * 500, // Delay each star's animation
        ease: 'Bounce.easeOut', // Add a bounce effect
      });
    });
  }
  
  
}

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
    this.dynamicTexts = [];
  }

  preload() {
    this.load.image('bg', 'assets/main_background.png')
    this.load.image('documentPassport', 'assets/passport_normal_visa_normal.png')
    this.load.image('documentVisa', 'assets/visa_normal_passport_normal.png')
    this.load.image('documentBoardingPass', 'assets/boardingpass.png')
    this.load.image('buttonNext', 'assets/button_next.png')
    this.load.image('buttonPrev', 'assets/button_prev.png')
    this.load.image('barContainer', 'assets/bar_container_big.png')
    this.load.image('barFillLong', 'assets/bar_fill_long.png')
    this.load.image('buttonApproved', 'assets/button_approved.png')
    this.load.image('buttonDeclined', 'assets/button_declined.png')
    this.load.image('passportPerson', 'assets/person_female_2.png')
    this.load.image('stampApproved', 'assets/stempel_approved.png')
    this.load.image('stampDeclined', 'assets/stempel_declined.png')
  }

  create() {
    // Initialize state
    this.initState()
  
    // Add background
    this.createBackground()
  
    // Add UI elements
    this.createUI()
  
    // Add buttons with interactivity
    this.createButtons()
  
    // Add text
    this.createText()

    this.createDocumentImages()
  }
  
  // Initialize state variables
  initState() {
    this.passportCountValue = 1
    this.passportCountValueMax = 3
    this.currentScore = 0
    this.documentCount = 0
    const documentRawData = generatePassportAndVisaData(6)
    this.documentData = mixPassportVisaTrueAndFakeData(documentRawData);
    this.documentImageList = [
      'documentPassport',
      'documentVisa',
      'documentBoardingPass'
    ]
  }
  
  // Create background
  createBackground() {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0)
    bg.setScale(sizes.width / bg.width, sizes.height / bg.height)
  }
  
  // Create static UI elements
  createUI() {
    const barContainer = this.add.image(sizes.width / 2 - 210, 100, 'barContainer').setOrigin(0)
    const barFillLong = this.add.image(sizes.width / 2 - 200, 106, 'barFillLong').setOrigin(0)
    
    barContainer.setScale(1.1)
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '32px',
      fill: '#fff',
    })

    // Initialize timer properties
  this.timerDuration = 30000 // Timer duration in milliseconds (5 seconds)
  this.timerElapsed = 0 // Tracks the elapsed time
  this.barFillLong = barFillLong // Reference for easy access

  // Set initial width of the barFillLong based on barContainer's width
  this.barFillLong.displayWidth = barContainer.displayWidth * 1 - 20
  this.originalWidth = this.barFillLong.displayWidth

  // Start the timer
  this.time.addEvent({
    delay: 16, // Update the bar every frame (~60 FPS)
    callback: this.updateTimer,
    callbackScope: this,
    loop: true
  })
  }

  updateTimer() {
    // Increment elapsed time
    this.timerElapsed += 16
  
    // Calculate the remaining width of the bar
    const remainingTime = Math.max(this.timerDuration - this.timerElapsed, 0)
    const percentage = remainingTime / this.timerDuration
    this.barFillLong.displayWidth = this.originalWidth * percentage
    
    if (percentage < 0.5) {
      this.barFillLong.setTint(0xff0000) // Red when less than 30% time left
    } else {
      this.barFillLong.clearTint(); // Ensure tint is cleared if above 50%
    }
    // Check if timer has run out
    if (remainingTime <= 0) {
      this.barFillLong.displayWidth = 0 // Ensure it disappears completely
      // Handle timer end (e.g., game over, next step)
      console.log('Timer finished!')
      this.moveToNextDocument()
      
      this.updateScene()
    }
  }
  
  // Create buttons and interactivity
  createButtons() {
    const buttonNext = this.add.image(sizes.width - 100, sizes.height - 300, 'buttonNext')
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
     
    const buttonPrev = this.add.image(100, sizes.height - 300, 'buttonPrev')
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
  
    const buttonApproved = this.add.image(sizes.width / 2 + 155, sizes.height - 100, 'buttonApproved').setOrigin(0).setInteractive({ useHandCursor: true })
    const buttonDeclined = this.add.image(sizes.width / 2 - 340, sizes.height - 100, 'buttonDeclined').setOrigin(0).setInteractive({ useHandCursor: true })

    
    
    let isButtonDisabled = false; // Flag to track the button's state

    buttonApproved.on('pointerdown', () => {
      if (isButtonDisabled) return; // Ignore clicks if the button is disabled
      
      const documentNow = this.documentData[this.documentCount];
      
      // Disable the button to prevent further clicks
      isButtonDisabled = true;
      buttonApproved.setInteractive(false); // Make the button non-interactive
      
      // Add the stamp image
      const stampApproved = this.add.image(300, 480, 'stampApproved').setOrigin(0);
      stampApproved.setScale(1);
      stampApproved.setDepth(10);
      
      // Check validity and update score
      if (documentNow.valid) {
        this.currentScore++;
      }
      
      console.log('Declined document:', documentNow.valid);
      
      // Add a click animation to the button
      this.tweens.add({
        targets: buttonApproved,
        scale: 0.9, // Slightly shrink on click
        duration: 100,
        ease: 'Power1',
        yoyo: true, // Bring back to original size
      });
      
      // Add a stamped animation for the stamp image
      this.tweens.add({
        targets: stampApproved,
        scale: 1, // Scale up from initial size
        rotation: Phaser.Math.DegToRad(-15), // Slight tilt
        duration: 300,
        ease: 'Bounce.easeOut',
        onComplete: () => {
          // After animation finishes, move to next document
          this.time.delayedCall(1000, () => {
            console.log('X');
            stampApproved.destroy(); // Remove the stamp
            this.moveToNextDocument();
            
            // Re-enable the button after the delay
            isButtonDisabled = false;
            buttonApproved.setInteractive(true); // Make the button interactive again
          });
        },
      });
    });

    buttonDeclined.on('pointerdown', () => {
      if (isButtonDisabled) return; // Ignore clicks if the button is disabled
      
      const documentNow = this.documentData[this.documentCount];
      
      // Disable the button to prevent further clicks
      isButtonDisabled = true;
      buttonDeclined.setInteractive(false); // Make the button non-interactive
      
      // Add the stamp image
      const stampDeclined = this.add.image(300, 480, 'stampDeclined').setOrigin(0);
      stampDeclined.setScale(1);
      stampDeclined.setDepth(10);
      
      // Check validity and update score
      if (!documentNow.valid) {
        this.currentScore++;
      }
      
      console.log('Declined document:', documentNow.valid);
      
      // Add a click animation to the button
      this.tweens.add({
        targets: buttonDeclined,
        scale: 0.9, // Slightly shrink on click
        duration: 100,
        ease: 'Power1',
        yoyo: true, // Bring back to original size
      });
      
      // Add a stamped animation for the stamp image
      this.tweens.add({
        targets: stampDeclined,
        scale: 1, // Scale up from initial size
        rotation: Phaser.Math.DegToRad(-15), // Slight tilt
        duration: 300,
        ease: 'Bounce.easeOut',
        onComplete: () => {
          // After animation finishes, move to next document
          this.time.delayedCall(1000, () => {
            console.log('X');
            stampDeclined.destroy(); // Remove the stamp
            this.moveToNextDocument();
            
            // Re-enable the button after the delay
            isButtonDisabled = false;
            buttonDeclined.setInteractive(true); // Make the button interactive again
          });
        },
      });
    });

    
  
    buttonNext.on('pointerdown', () => {
      this.passportCountValue = this.passportCountValue === this.passportCountValueMax
        ? 1
        : this.passportCountValue + 1
        this.tweens.add({
          targets: buttonNext,
          scale: 0.9, // Slightly shrink on click
          duration: 100,
          ease: 'Power1',
          yoyo: true, // Bring back to original size
        });
      this.updateScene()
    })
  
    buttonPrev.on('pointerdown', () => {
      this.passportCountValue = this.passportCountValue === 1
        ? this.passportCountValueMax
        : this.passportCountValue - 1
        this.tweens.add({
          targets: buttonPrev,
          scale: 0.9, // Slightly shrink on click
          duration: 100,
          ease: 'Power1',
          yoyo: true, // Bring back to original size
        });
      this.updateScene()
    })
  }
  
  // Create dynamic text
  createText() {
    this.passportCountText = this.add.text(
      sizes.width / 2 - 40,
      150,
      `${this.passportCountValue}/${this.passportCountValueMax}`,
      {
        fontSize: '32px',
        fill: '#fff',
        backgroundColor: '#685752',
        padding: { left: 10, right: 10, top: 5, bottom: 5 }
      }
    ).setOrigin(0)

    

  }
  
  createDocumentImages() {
    // Debug: Log passportCountValue
    console.log('Passport Count Value:', this.passportCountValue);
    console.log('Document Count:', this.documentData[this.documentCount]);
    
    // Step 1: Destroy old text objects
    if (this.dynamicTexts && this.dynamicTexts.length) {
      console.log('Clearing old text objects');
      this.clearDynamicTexts();
    }
  
    // Step 2: Destroy old document image
    if (this.documentImages) {
      this.documentImages.destroy();
    }
  
    // Add new document image
    this.documentImages = this.add.image(125, sizes.height - 500, this.documentImageList[this.passportCountValue - 1]).setOrigin(0);
    this.documentImages.setTexture(this.documentImageList[this.passportCountValue - 1]);
  
    // Add person details
    this.documentPersonBg = this.add.rectangle(sizes.width / 2 - 145, sizes.height - 255, 80, 80, 0xffffff).setOrigin(0);
    this.documentPerson = this.add.image(sizes.width / 2 - 130, sizes.height - 250, 'passportPerson').setOrigin(0).setScale(0.5);
    
    // Step 3: Add texts
  
      if(this.passportCountValue === 1) {
        const content = this.documentData[this.documentCount].passport;
      // Dynamically add text
      const documentTexts = [
        { x: sizes.width / 2 - 40, y: 420, text: `PASSPORT`, fontSize: '16px' },
        { x: sizes.width / 2 + 50, y: 425, text: `NO. ${content.passportNumber}`, fontSize: '12px' },
        { x: sizes.width / 2 - 50, y: 450, text: `NAME\n\n${content.name}` },
        { x: sizes.width / 2 - 50, y: 490, text: `PLACE OF BIRTH\n\n${content.placeOfBirth}` },
        { x: sizes.width / 2 + 50, y: 450, text: `SEX\n\n${content.gender}` },
        { x: sizes.width / 2 + 50, y: 490, text: `DATE OF BIRTH\n\n${content.birthDate}` },
        { x: sizes.width / 2 - 50, y: 530, text: `NATIONALITY\n\n${content.nationality}` },
        { x: sizes.width / 2 + 50, y: 530, text: `JOB\n\n${content.job}` },
        { x: sizes.width / 2 - 50, y: 570, text: `ISSUED ON\n\n${content.issuedOn}` },
        { x: sizes.width / 2 + 50, y: 570, text: `EXPIRES ON\n\n${content.expiresOn}` },
        { x: sizes.width / 2 - 133, y: 540, text: `SIGNATURE\n\n\n\n${content.signature}` },
      ];
  
      documentTexts.forEach(({ x, y, text, fontSize }) => {
        const textObject = this.addDocumentText(x, y, text, fontSize);
        this.dynamicTexts.push(textObject); // Store the text object
      });
  
      const narrationContent = this.documentData[this.documentCount].narration;
      const narrationTextGenerate = getNarrationText(narrationContent);
      // Add narration text
      const narrationText = this.addDocumentText(
        sizes.width / 2 - 133,
        220,
        narrationTextGenerate,
        '12px'
      ).setStyle({ lineSpacing: 10, wordWrap: { width: 240 } });
  
      this.dynamicTexts.push(narrationText); // Store narration text
    } else if (this.passportCountValue === 2) {
      const content = this.documentData[this.documentCount].visa;
      const documentTexts = [
        { x: sizes.width / 2 - 20, y: 420, text: `VISA`, fontSize: '16px' },
        // { x: sizes.width / 2 + 50, y: 425, text: `NO. ${content.passportNumber}`, fontSize: '12px' },
        { x: sizes.width / 2 - 50, y: 450, text: `NAME\n\n${content.name}` },
        // { x: sizes.width / 2 - 50, y: 490, text: `PLACE OF BIRTH\n\n${content.placeOfBirth}` },
        { x: sizes.width / 2 + 50, y: 450, text: `SEX\n\n${content.gender}` },
        { x: sizes.width / 2 + 50, y: 490, text: `DATE OF BIRTH\n\n${content.birthDate}` },
        { x: sizes.width / 2 - 50, y: 490, text: `NATIONALITY\n\n${content.nationality}` },
        { x: sizes.width / 2 - 50, y: 530, text: `ISSUED ON\n\n${content.issuedOn}` },
        { x: sizes.width / 2 + 50, y: 530, text: `EXPIRES ON\n\n${content.expiresOn}` },
        { x: sizes.width / 2 - 133, y: 540, text: `SIGNATURE\n\n\n\nSIGNATURE` },
      ];
      
      documentTexts.forEach(({ x, y, text, fontSize }) => {
        const textObject = this.addDocumentText(x, y, text, fontSize);
        this.dynamicTexts.push(textObject); // Store the text object
      });
      const narrationContent = this.documentData[this.documentCount].narration;
      const narrationTextGenerate = getNarrationText(narrationContent);
      // Add narration text
      const narrationText = this.addDocumentText(
        sizes.width / 2 - 133,
        220,
        narrationTextGenerate,
        '12px'
      ).setStyle({ lineSpacing: 10, wordWrap: { width: 240 } });
  
      this.dynamicTexts.push(narrationText); // Store narration text

    } else if (this.passportCountValue === 3) {
      if(this.documentPerson && this.documentPersonBg) {
        this.documentPerson.destroy()
        this.documentPersonBg.destroy()
      }

      const content = this.documentData[this.documentCount].boardingPass;
      const documentTexts = [
        { x: 160, y: 460, text: `FLIGHT\n\n${content.flightCode}` },
        { x: 210, y: 460, text: `TERMINAL\n\n${content.terminal}` },
        { x: 280, y: 460, text: `GATE\n\n${content.gate}` },
        { x: 330, y: 460, text: `SEAT\n\n${content.seat}` },
        { x: 415, y: 365, text: `NAME\n\n${content.passengerTop}` },
        { x: 485, y: 365, text: `CLASS\n\n${content.classType}` },
        { x: 165, y: 370, text: `FROM\n\n${content.flightFrom.city}`, fontSize: '14px' },
        { x: 290, y: 370, text: `TO\n\n${content.flightTo.city}`, fontSize: '14px' },
        { x: 165, y: 390, text: `\n\n${content.takeOff.date} \n${content.takeOff.time}`, fontSize: '14px' },
        { x: 290, y: 390, text: `\n\n${content.Landing.date} \n${content.Landing.time}`, fontSize: '14px' },
      ];
      
      documentTexts.forEach(({ x, y, text, fontSize }) => {
        const textObject = this.addDocumentText(x, y, text, fontSize);
        this.dynamicTexts.push(textObject); // Store the text object
      });
    }
  }
  
  
  addDocumentText(x, y, text, fontSize = '10px') {
    return this.add.text(x, y, text, {
      fontSize,
      fill: '#000',
    }).setOrigin(0);
  }
  
  clearDynamicTexts() {
    this.dynamicTexts.forEach(text => text.destroy());
    this.dynamicTexts = []; // Clear the array
  }
  updateScene() {
    this.passportCountText.setText(`${this.passportCountValue}/${this.passportCountValueMax}`)
    this.createDocumentImages()
    this.scoreText.setText(`Score: ${this.currentScore}`)
  }

  moveToNextDocument() {
    this.timerElapsed = 0 // Reset the timer elapsed
    if (this.documentCount >= this.documentData.length - 1) {
      console.log('No more documents')
      this.scene.start('EndScene', { score: this.currentScore })
    } else {
      this.documentCount++
    }
    this.passportCountValue = 1 // Reset to passport for the next document
    this.updateScene()
  }

  

  update() {
  }

}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  scene: [HomeScene, MainScene, EndScene],
}


const game = new Phaser.Game(config)

// Mockup data
// Mockup dat

const jobData = ["Teacher", "Engineer", "Doctor", "Artist", "Scientist"];

// Utility functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomDate(startYear, endYear) {
  const start = new Date(startYear, 0, 1);
  const end = new Date(endYear, 11, 31);
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().slice(0, 10).split("-").reverse().join(" ");
}

function generateRandomNaration(passport) {
  const {name, birthDate, nationality} = passport
  console.log(birthDate)
  const birthYear = birthDate.split(" ")[2]; // Splits by space and gets the year (index 2)
  const age = new Date().getFullYear() - parseInt(birthYear, 10); // Ensure year is a number

  return {
    narrationName: name,
    narrationAge: age,
    narrationNationality: nationality,
    valid: true
  }

  const {narrationAge, narrationName, narrationNationality} = narrationData
  return `Hai, saya ${narrationName}. Saya berusia ${narrationAge} tahun, saya seorang ${narrationNationality}, saya berniat melakukan perjalanan!`
}

function generateRandomPassport() {
  const { name, gender } = getRandomItem(nameData);
  const nationality = getRandomItem(nationalityData).country;
  const placeOfBirth = nationality
  const job = getRandomItem(jobData);
  const currentYear = new Date().getFullYear();
  const issuedYear = Math.floor(Math.random() * (currentYear - (currentYear - 10) + 1)) + (currentYear - 10); // Issued within the last 10 years
  const expiresYear = issuedYear + 10; // 10-year validity
  const passportNumber = Math.random().toString(36).substr(2, 8).toUpperCase();
  const birthDate = generateRandomDate(1960, 2000);
  const narrationAge = currentYear - birthDate.split("-")[0];

  return {
    id: Math.floor(Math.random() * 100),
    name,
    gender,
    birthDate,
    nationality,
    placeOfBirth,
    job,
    passportNumber,
    issuedOn: generateRandomDate(issuedYear, issuedYear),
    expiresOn: generateRandomDate(expiresYear, expiresYear),
    signature: name.toUpperCase(),
    valid: true,
    error: null
  };
}

function generateVisaData(passport) {
  const issueDate = new Date(); // Visa issued today
  const expiryDate = new Date();
  expiryDate.setDate(issueDate.getDate() + 90); // Add 90 days

  return {
    id: Math.floor(Math.random() * 100),
    name: passport.name, // Match passport name
    gender: passport.gender, // Match passport gender
    birthDate: passport.birthDate, // Match passport birth date
    nationality: passport.nationality, // Match passport nationality
    issuedOn: issueDate.toISOString().slice(0, 10).split("-").reverse().join(" "), // Visa issued date
    expiresOn: expiryDate.toISOString().slice(0, 10).split("-").reverse().join(" "), // Visa expiry date
    valid: true,
    error: null
  };
}

function generateBoardingPass(passport) {
  const issueDate = new Date(); // Visa issued today
  const expiryDate = new Date();
  expiryDate.setDate(issueDate.getDate() + 90); // Add 90 days
  const flightFrom = {
    code: 'JFK',
    city: getRandomItem(nationalityData).country
  }
  const flightTo = {
    code: 'BDJ',
    city: 'Banjarmasin'
  };

  // Helper function to format date and time
  function formatDateTime(dateObj) {
    const date = dateObj.toISOString().split("T")[0]; // Extract date in YYYY-MM-DD
    const time = dateObj.toTimeString().split(" ")[0]; // Extract time in HH:MM:SS
    return { date, time };
  }

  // Randomize Take-Off Date: Either Today or Tomorrow
  const takeOffDateObj = new Date();
  if (Math.random() > 0.5) {
    takeOffDateObj.setDate(takeOffDateObj.getDate() + 1); // Set to tomorrow
  }

  // Landing Date: At least 3 hours after Take-Off
  const landingDateObj = new Date(takeOffDateObj.getTime() + 3 * 60 * 60 * 1000);

  // Create objects with separate date and time
  const takeOff = formatDateTime(takeOffDateObj);
  const Landing = formatDateTime(landingDateObj);

  console.log("Take-Off:", takeOff); // { date: 'YYYY-MM-DD', time: 'HH:MM:SS' }
  console.log("Landing:", Landing); // { date: 'YYYY-MM-DD', time: 'HH:MM:SS' }

  // Helper function to generate a random integer between min and max (inclusive)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper function to pick a random value from an array
  function getRandomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  // Generate random values as per the requirements
  const terminal = `${getRandomInt(1, 5)}${getRandomFromArray(['A', 'B', 'C', 'D'])}`; // 1-5 with A-D
  const flightCode = `EP${getRandomInt(100, 999)}`; // "EP" with 3 random digits
  const gate = `${getRandomFromArray(['A', 'B', 'C', 'D', 'E'])}${getRandomInt(1, 5)}`; // A-E with 1-5
  const seat = `${getRandomInt(1, 30)}${getRandomFromArray(['A', 'B', 'C', 'D'])}`; // 1-30 with A-D
  const classType = getRandomFromArray(['Business', 'Economy', 'First']); // Random class type

  // Output the results
  console.log("Terminal:", terminal);
  console.log("Flight Code:", flightCode);
  console.log("Gate:", gate);
  console.log("Seat:", seat);
  console.log("Class Type:", classType);





  return {
    id: Math.floor(Math.random() * 100),
    passengerBottom: passport.name, // Match passport name
    passengerTop: passport.name, // Match passport name
    flightFrom,
    flightTo,
    takeOff,
    Landing,
    terminal,
    flightCode,
    gate,
    seat,
    classType,
    valid: true,
    error: null
  };
}

function generatePassportAndVisaData(count = 5) {
  const combinedData = [];

  for (let i = 0; i < count; i++) {
    const passport = generateRandomPassport(); // Generate passport data
    const visa = generateVisaData(passport); // Generate matching visa data
    const boardingPass = generateBoardingPass(passport); // Generate boarding pass data
    const narration = generateRandomNaration(passport)
    combinedData.push({
      passport,
      visa,
      boardingPass,
      narration,
      valid: true, // Initially valid because they match
    });
  }

  return combinedData;
}

function fakeBoardingPassData(boardingPass) {
  const fakeData = { ...boardingPass };
  const randomRule = Math.floor(Math.random() * 3); // Choose a random rule to fake data
  const currentDate = new Date().toISOString().slice(0, 10).split("-").reverse().join(" ");
  switch (randomRule) {
    case 0: // Change landing city
      fakeData.flightTo.city = getRandomItem(nationalityData).country.toUpperCase();
      fakeData.error = "BoardingPass: Kota Pendaratan Tidak Sesuai"
      break;
    case 1: // change passengerTop Name
      fakeData.passengerTop = getRandomItem(nameData).name.toUpperCase();
      fakeData.error = "BoardingPass: Nama Penumpang Tidak Sesuai"
      break;
    case 2: // change passengerBot Name
      fakeData.passengerBottom = getRandomItem(nameData).name.toUpperCase();
      fakeData.error = "BoardingPass: Nama Penumpang Tidak Sesuai"
      break;
    case 3: // Change landing date
      fakeData.Landing.date = generateRandomDate(2024);
      fakeData.error = "BoardingPass: Tanggal Pendaratan Tidak Sesuai"
      break;
  }

  fakeData.valid = false; // Indicate fake data
  return fakeData;
}

// Function to fake data
function fakePassportData(passport) {
  const fakeData = { ...passport };
  const randomRule = Math.floor(Math.random() * 5); // Choose a random rule to fake data
  const currentYear = new Date().getFullYear();
  switch (randomRule) {
    case 0: // Change gender
      fakeData.gender = fakeData.gender === "MALE" ? "FEMALE" : "MALE";
      fakeData.error = "Passport: Jenis Kelamin Tidak Sesuai"
      break;
    case 1: // Alter passport number (more or less than 8 chars)
      fakeData.passportNumber = Math.random().toString(36).substr(2, Math.random() > 0.5 ? 7 : 9).toUpperCase();
      fakeData.error = "Passport: Nomor Paspor Tidak Sesuai"
      break;
    case 2: // Modify issued and expires to have a duration other than 10 years
      
      const issuedYear = Math.floor(Math.random() * (currentYear - 2010 + 1)) + 2010; // Between 2010 and current year
      const fakeExpiresYear = issuedYear + (Math.random() > 0.5 ? 8 : 12); // 8 or 12 years
      fakeData.issuedOn = generateRandomDate(issuedYear, issuedYear);
      fakeData.expiresOn = generateRandomDate(fakeExpiresYear, fakeExpiresYear);
      fakeData.error = "Passport: Tanggal Berlaku Tidak Sesuai"
      break;
    
    case 3: // Make expires already expired
      const expiredYear = Math.floor(Math.random() * (currentYear - 2000)) + 2000; // Between 2000 and current year
      fakeData.issuedOn = generateRandomDate(expiredYear, expiredYear);
      fakeData.expiresOn = generateRandomDate(expiredYear + Math.floor(Math.random() * 10), expiredYear + Math.floor(Math.random() * 10)); // Always before today
      if (new Date(fakeData.expiresOn).getTime() > Date.now()) {
        fakeData.expiresOn = generateRandomDate(expiredYear, expiredYear); // Adjust to ensure it is in the past
      }
      fakeData.error = "Passport: Paspor Sudah Kadaluarsa"
      break;    
    case 4: // Change signature to a random name
      const randomName = getRandomItem(nameData).name.toUpperCase();
      if (randomName !== fakeData.name.toUpperCase()) {
        fakeData.signature = randomName;
      } else {
        fakeData.signature = getRandomItem(nameData).name.toUpperCase();
      }
      fakeData.error = "Passport: Tanda Tangan Tidak Sesuai"
      break;

      case 5: //Change narrationName 
      fakeData.narrationName = getRandomItem(nameData).name.toUpperCase();
      fakeData.error = "Passport: Nama Pada Narasi Tidak Sesuai"
      break;

      case 6 : // Change narrationNationality
      fakeData.narrationNationality = getRandomItem(nationalityData).country;
      fakeData.error = "Passport: Kewarganegaraan Pada Narasi Tidak Sesuai"
      break;

      case 7 : // Change narrationAge
      fakeData.narrationAge = Math.floor(Math.random() * 100);
      fakeData.error = "Passport: Umur Pada Narasi Tidak Sesuai"
      break;
  }

  fakeData.valid = false; // Indicate fake data
  return fakeData;
}

function fakeVisaData(visa, passport) {
  const fakeVisa = { ...visa };
  const randomRule = Math.floor(Math.random() * 4); // Choose random mismatch rule (0 to 3)

  switch (randomRule) {
    case 0: // Change name
      fakeVisa.name = getRandomItem(nameData).name;
      fakeVisa.error = "Visa: Nama Tidak Sesuai"
      break;
    case 1: // Change birth date
      fakeVisa.birthDate = generateRandomDate(1960, 2000);
      fakeVisa.error = "Visa: Tanggal Lahir Tidak Sesuai"
      break;
    case 2: // Change nationality
      fakeVisa.nationality = getRandomItem(nationalityData).country;
      fakeVisa.error = "Visa: Kewarganegaraan Tidak Sesuai"
      break;
    case 3: // Modify expiry date
      const issueDate = new Date(fakeVisa.issuedOn.split(" ").reverse().join("-"));
      const randomExpiryOption = Math.random();
      if (randomExpiryOption < 0.5) {
        // Already expired (before today)
        const expiredDate = new Date();
        expiredDate.setDate(issueDate.getDate() - Math.floor(Math.random() * 30 + 1)); // Expired within 30 days before issue date
        fakeVisa.expiresOn = expiredDate.toISOString().slice(0, 10).split("-").reverse().join(" ");
      } else {
        // Modify duration to more/less than 90 days
        const modifiedExpiryDate = new Date(issueDate);
        modifiedExpiryDate.setDate(issueDate.getDate() + (Math.random() > 0.5 ? 60 : 120)); // 60 or 120 days
        fakeVisa.expiresOn = modifiedExpiryDate.toISOString().slice(0, 10).split("-").reverse().join(" ");
      }
      fakeVisa.error = "Visa: Tanggal Berlaku Tidak Sesuai"
      break;
      case 4: // change gender
      fakeVisa.gender = fakeVisa.gender === "MALE" ? "FEMALE" : "MALE";
      fakeVisa.error = "Visa: Jenis Kelamin Tidak Sesuai"
      break;
  }

  return {
    ...fakeVisa,
    valid: false, // Indicate fake data
  };
}

function fakeNarrationData(narration) {
  const fakeNarration = { ...narration };
  const randomRule = Math.floor(Math.random() * 4); // Choose random mismatch rule (0 to 3)
  switch (randomRule) {
    case 0: // Change name
      fakeNarration.narrationName = getRandomItem(nameData).name;
      fakeNarration.error = "Narration: Nama Tidak Sesuai Pada Narasi"
      break;
    case 1: // Change age
      fakeNarration.narrationAge = Math.floor(Math.random() * 100);
      fakeNarration.error = "Narration: Umur Tidak Sesuai Pada Narasi"
      break;
    case 2: // Change nationality
      fakeNarration.narrationNationality = getRandomItem(nationalityData).country;
      fakeNarration.error = "Narration: Kewarganegaraan Tidak Sesuai Pada Narasi"
      break;
  }

  return {
    ...fakeNarration,
    valid: false, // Indicate fake data
  }
}

// Function to mix true and fake data
function mixPassportVisaTrueAndFakeData(data) {
  const mixedData = [...data];
  const numFakes = Math.floor(Math.random() * mixedData.length) + 1; // At least 1 fake

  const date = new Date(); // Define the current date
  for (let i = 0; i < numFakes; i++) {
    const indexToFake = Math.floor(Math.random() * mixedData.length);
    const fakeType = ["passport", "visa", "boardingPass", "narration"][Math.floor(Math.random() * 4)];
    console.log("Fake Type:", fakeType);

    if (fakeType === "passport") {
      mixedData[indexToFake].passport = fakePassportData(mixedData[indexToFake].passport);
    } else if(fakeType === "visa") {
      mixedData[indexToFake].visa = fakeVisaData(
        mixedData[indexToFake].visa,
        mixedData[indexToFake].passport
      );
    } else if(fakeType === "boardingPass") {
      mixedData[indexToFake].boardingPass = fakeBoardingPassData(mixedData[indexToFake].boardingPass);
    } else {
      mixedData[indexToFake].narration = fakeNarrationData(mixedData[indexToFake].narration);
    }

    // Revalidate data
    mixedData[indexToFake].valid =
    mixedData[indexToFake].passport.name === mixedData[indexToFake].visa.name &&
    mixedData[indexToFake].passport.name === mixedData[indexToFake].boardingPass.passengerTop &&
    mixedData[indexToFake].narration.narrationName === mixedData[indexToFake].passport.name &&
    mixedData[indexToFake].narration.narrationNationality === mixedData[indexToFake].passport.nationality &&
    mixedData[indexToFake].narration.narrationAge === mixedData[indexToFake].passport.age &&
    mixedData[indexToFake].boardingPass.passengerTop === mixedData[indexToFake].boardingPass.passengerBottom &&
    mixedData[indexToFake].passport.birthDate === mixedData[indexToFake].visa.birthDate &&
    mixedData[indexToFake].passport.nationality === mixedData[indexToFake].visa.nationality &&
    mixedData[indexToFake].passport.gender === mixedData[indexToFake].visa.gender &&
    mixedData[indexToFake].boardingPass.flightTo.city === "Banjarmasin" &&
    mixedData[indexToFake].boardingPass.Landing.date === date.toISOString().slice(0, 10).split("-").reverse().join(" ") &&
    mixedData[indexToFake].passport.valid &&
    mixedData[indexToFake].visa.valid &&
    mixedData[indexToFake].boardingPass.valid &&
    mixedData[indexToFake].narration.valid;
  }

  return mixedData;
}

function getError(data) {
  return data.passport.error || data.visa.error || data.boardingPass.error || data.narration.error || null;
}

function getNarrationText(narrationData) {
  return `Hai, saya ${narrationData.narrationName}. Saya berusia ${narrationData.narrationAge} tahun, saya berasal dari negara ${narrationData.narrationNationality}, saya berniat melakukan perjalanan...`
}

