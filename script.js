
class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapTimes = [];
        this.lapStartTime = 0;
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapSection = document.getElementById('lapSection');
        this.lapList = document.getElementById('lapList');
        this.clearLapsBtn = document.getElementById('clearLapsBtn');
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.lapBtn.addEventListener('click', () => this.lap());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.clearLapsBtn.addEventListener('click', () => this.clearLaps());
    }
    
    start() {
        this.startTime = Date.now() - this.elapsedTime;
        this.lapStartTime = this.elapsedTime;
        this.timerInterval = setInterval(() => this.updateDisplay(), 10);
        this.isRunning = true;
        
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.lapBtn.disabled = false;
        this.timeDisplay.classList.add('running');
        
        this.startBtn.textContent = 'Running';
    }
    
    pause() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        this.timeDisplay.classList.remove('running');
        
        this.startBtn.textContent = 'Resume';
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.startTime = 0;
        this.elapsedTime = 0;
        this.lapStartTime = 0;
        this.isRunning = false;
        
        this.updateDisplay();
        this.clearLaps();
        
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        this.timeDisplay.classList.remove('running');
        
        this.startBtn.textContent = 'Start';
        this.lapSection.style.display = 'none';
    }
    
    lap() {
        const currentTime = this.elapsedTime;
        const lapTime = currentTime - this.lapStartTime;
        
        this.lapTimes.push({
            total: currentTime,
            split: lapTime,
            number: this.lapTimes.length + 1
        });
        
        this.lapStartTime = currentTime;
        this.updateLapDisplay();
        this.lapSection.style.display = 'block';
    }
    
    clearLaps() {
        this.lapTimes = [];
        this.lapList.innerHTML = '';
        this.lapSection.style.display = 'none';
    }
    
    updateDisplay() {
        if (this.isRunning) {
            this.elapsedTime = Date.now() - this.startTime;
        }
        
        const time = this.formatTime(this.elapsedTime);
        this.timeDisplay.textContent = time;
    }
    
    updateLapDisplay() {
        const lapItem = document.createElement('li');
        lapItem.className = 'lap-item';
        
        const lastLap = this.lapTimes[this.lapTimes.length - 1];
        
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${lastLap.number}</span>
            <div>
                <div class="lap-time">${this.formatTime(lastLap.total)}</div>
                <div class="lap-split">+${this.formatTime(lastLap.split)}</div>
            </div>
        `;
        
        this.lapList.insertBefore(lapItem, this.lapList.firstChild);
        
        
        if (this.lapTimes.length > 1) {
            this.highlightExtremes();
        }
        
        
        lapItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    highlightExtremes() {
        const lapItems = this.lapList.querySelectorAll('.lap-item');
        const splitTimes = this.lapTimes.map(lap => lap.split);
        const fastest = Math.min(...splitTimes);
        const slowest = Math.max(...splitTimes);
        
        
        lapItems.forEach(item => {
            item.classList.remove('fastest', 'slowest');
        });
        
        
        this.lapTimes.forEach((lap, index) => {
            const itemIndex = this.lapTimes.length - 1 - index;
            const item = lapItems[itemIndex];
            
            if (lap.split === fastest && fastest !== slowest) {
                item.classList.add('fastest');
            } else if (lap.split === slowest && fastest !== slowest) {
                item.classList.add('slowest');
            }
        });
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
});
