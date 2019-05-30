export default class FeaturesChart{

    constructor( data, elem) {
        this.randomColors= [
            'rgba(30,215,96, 0.9)',
            'rgba(245,115,160, 0.9)',
            'rgba(80,155,245, 0.9)',
            'rgba(255,100,55, 0.9)',
            'rgba(180,155,200, 0.9)',
            'rgba(250,230,45, 0.9)',
            'rgba(0,100,80, 0.9)',
            'rgba(175,40,150, 0.9)',
            'rgba(36,59,119,0.9)',
            'rgba(250,146,26,0.9)',
            'rgba(144,42,58,0.9)',
            'rgba(135,175,23,0.9)',
            'rgba(19,129,143,0.9)'
        ];
        this.featuresChart = elem;
        this.featuresChart.style.width = this.featuresChart.offsetWidth;
        this.featuresChart.width = this.featuresChart.offsetWidth * 2;
        this.featuresChart.style.height = this.featuresChart.offsetHeight;
        this.featuresChart.height = this.featuresChart.offsetHeight * 2;
        this.provideAnimationFrame = null;
        this.width     = this.featuresChart.width;
        this.height    = this.featuresChart.height;
        this.ctx       = this.featuresChart.getContext("2d");
        this.img = new Image;

        this.init(data);
    }

    binaryIndexOf(searchElement, valueof, valueout){

        'use strict';
        let minIndex = 0;
        let maxIndex = this.length - 1;
        let currentIndex;
        let currentElement;

        while (minIndex <= maxIndex) {
            currentIndex = (minIndex + maxIndex) / 2 | 0;
            currentElement = valueof(this[currentIndex]);

            if (currentElement < searchElement && ((currentIndex + 1 < this.length) ? valueof(this[currentIndex+1]) : Infinity) > searchElement) {
                return valueout(currentElement, currentIndex, this);
            }
            if (currentElement < searchElement) {
                minIndex = currentIndex + 1;
            }
            else if (currentElement > searchElement) {
                maxIndex = currentIndex - 1;
            }
            else {
                return this[currentIndex];
            }
        }
        return -1;
    }

    destroy(){
        if(!!this.provideAnimationFrame){
            window.cancelAnimationFrame(this.provideAnimationFrame);
            this.provideAnimationFrame = null;
        }
    }

    init(data){

        function binaryIndexOf(searchElement, valueof, valueout) {
            'use strict';
            let minIndex = 0;
            let maxIndex = this.length - 1;
            let currentIndex;
            let currentElement;

            while (minIndex <= maxIndex) {
                currentIndex = (minIndex + maxIndex) / 2 | 0;
                currentElement = valueof(this[currentIndex]);

                if (currentElement < searchElement && ((currentIndex + 1 < this.length) ? valueof(this[currentIndex+1]) : Infinity) > searchElement) {
                    return valueout(currentElement, currentIndex, this);
                }
                if (currentElement < searchElement) {
                    minIndex = currentIndex + 1;
                }
                else if (currentElement > searchElement) {
                    maxIndex = currentIndex - 1;
                }
                else {
                    return this[currentIndex];
                }
            }
            return -1;
        }

        const getCurrentAndLastArrayLikes = (arrayLikes, time) => arrayLikes.map(arrayLike => binaryIndexOf.call(arrayLike, time, e => e.start, (element, index, array) => ([array[index], array[index > 0 ? index - 1 : 0]])));
        const getRowPosition = index => index === 0 ? 0 : 1 / index + getRowPosition(index-1);
        const getFloorRowPosition = (searchPosition, rowHeight, i = 0, max = 5) => i > max ? max : searchPosition < (getRowPosition(i + 1) * rowHeight) ? i : getFloorRowPosition(searchPosition, rowHeight, i + 1, max);

        // const width     = this.featuresChart.width;
        // const height    = this.featuresChart.height;
        // const ctx       = this.featuresChart.getContext("2d");

        const arrayLikesEntries = Object.entries(data).filter(entry => entry[1] instanceof Array).sort((a, b) => a[1].length - b[1].length)
        const arrayLikesKeys    = arrayLikesEntries.map(entry => entry[0]);
        const arrayLikes        = arrayLikesEntries.map(entry => entry[1]);

        const rowHeight = this.height / arrayLikes.length;

        arrayLikes.forEach((arrayLike, arrayLikeIndex) => {
            const startY = getRowPosition(arrayLikeIndex) * rowHeight;
            const arrayLikeHeight = rowHeight / (arrayLikeIndex + 1);

            arrayLike.forEach((section, sectionIndex) => {
                this.ctx.fillStyle = this.randomColors[sectionIndex % this.randomColors.length];
                this.ctx.fillRect(section.start/data.track.duration*this.width, getRowPosition(arrayLikeIndex) * rowHeight, section.duration/data.track.duration*this.width, arrayLikeHeight);
            });

            const label = arrayLikesKeys[arrayLikeIndex].charAt(0).toUpperCase() + arrayLikesKeys[arrayLikeIndex].slice(1)
            this.ctx.fillStyle = "#000";
            this.ctx.font = `bold ${arrayLikeHeight}px Circular`;
            this.ctx.fillText(label,0,startY + arrayLikeHeight);
        });

        const markerHeight = getRowPosition(arrayLikes.length) * rowHeight;

        this.provideAnimationFrame=(timestamp)=> {

            window.player && window.player.getCurrentState().then(state => {
                if(data.track && state){


                    this.ctx.clearRect(0, 0, this.width, this.height);
                    this.ctx.drawImage(this.img,0,0);
                    this.ctx.fillStyle = "#000";
                    const position = state.position/1000/data.track.duration*this.width
                    this.ctx.fillRect(position-2, 0, 5, markerHeight);
                    const currentAndLastArrayLikes = getCurrentAndLastArrayLikes(arrayLikes, state.position/1000);

                    const pitchChanges = currentAndLastArrayLikes ? currentAndLastArrayLikes[3][0].pitches.map((pitch, index) => Math.abs(pitch - currentAndLastArrayLikes[3][1].pitches[index])) : [];
                    const timbreChanges = currentAndLastArrayLikes ? currentAndLastArrayLikes[3][0].timbre.map((timbre, index) => Math.abs(timbre - currentAndLastArrayLikes[3][1].timbre[index])) : [];

                    // Pitch boxes
                    const boxW = 60;

                    this.ctx.strokeStyle = "#AAA";

                    currentAndLastArrayLikes[3][0].pitches.forEach((pitchChange, i) => {
                        this.ctx.fillStyle = `hsl(0, 20%, ${pitchChange * 100}%)`;
                        this.ctx.fillRect(i*boxW, this.height - boxW, boxW, boxW);
                    });

                    pitchChanges.forEach((pitchChange, i) => {
                        this.ctx.fillStyle = `hsl(0, 40%, ${pitchChange * 100}%)`;
                        this.ctx.fillRect(i*boxW, this.height - 2 * boxW, boxW, boxW);
                    });

                    currentAndLastArrayLikes[3][0].timbre.forEach((pitchChange, i) => {
                        this.ctx.fillStyle = `hsl(0, 60%, ${pitchChange * 100}%)`;
                        this.ctx.fillRect(i*boxW, this.height - 3 * boxW, boxW, boxW);
                    });

                    timbreChanges.forEach((timbreChange, i) => {
                        this.ctx.fillStyle = `hsl(0, 80%, ${timbreChange * 100}%)`;
                        this.ctx.fillRect(i*boxW, this.height - 4 * boxW, boxW, boxW);
                    });

                }
                if(!!this.provideAnimationFrame) window.requestAnimationFrame(this.provideAnimationFrame);

            }).catch(e => {
                console.error("Animation: ", e);
                //window.requestAnimationFrame(this.provideAnimationFrame);

            });
        }
        window.requestAnimationFrame(this.provideAnimationFrame);
        this.img.src = this.featuresChart.toDataURL('png');
    }
}

