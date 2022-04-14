import { populate, season, episode, episodesList, nextVideo } from './video';

interface VideoPlayerElements {
  videoPlayer: HTMLVideoElement;
  playButton: HTMLButtonElement;
  progressBar: HTMLInputElement;
  volumeButton: HTMLButtonElement;
  volumeBar: HTMLInputElement;
  currentVideoTime: HTMLInputElement;
  durationVideoTime: HTMLInputElement;
  nextButton: HTMLButtonElement;
}

interface videoPlayerProtocol {
  playToggle(): void;
  stop(): void;
  iniciarEventos(): void;
}
let seasonVideo: string;
let episodeVideo: string;

class VideoPlayer implements videoPlayerProtocol {
  private videoPlayer: HTMLVideoElement;
  private playButton: HTMLButtonElement;
  private progressBar: HTMLInputElement;
  private volumeButton: HTMLButtonElement;
  private volumeBar: HTMLInputElement;
  private currentVideoTime: HTMLInputElement;
  private durationVideoTime: HTMLInputElement;
  private nextButton: HTMLButtonElement;

  constructor(videoPlayerElements: VideoPlayerElements) {
    this.videoPlayer = videoPlayerElements.videoPlayer;
    this.playButton = videoPlayerElements.playButton;
    this.progressBar = videoPlayerElements.progressBar;
    this.volumeButton = videoPlayerElements.volumeButton;
    this.volumeBar = videoPlayerElements.volumeBar;
    this.currentVideoTime = videoPlayerElements.currentVideoTime;
    this.durationVideoTime = videoPlayerElements.durationVideoTime;
    this.nextButton = videoPlayerElements.nextButton;
  }

  playToggle(): void {
    if (this.videoPlayer.paused) {
      this.videoPlayer.play();
      this.playButton.classList.add('isPlaying');
      this.playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    } else {
      this.videoPlayer.pause();
      this.playButton.classList.remove('isPlaying');
      this.storeVideoTime();
      this.playButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    }
  }
  getParameter(): void {
    // eslint-disable-next-line prefer-const
    seasonVideo = window.location.href.substring(
      window.location.href.indexOf('season=') + 7,
    )[0];
    episodeVideo = window.location.href.substring(
      window.location.href.indexOf('episodes=') + 9,
    );
  }

  stop(): void {
    this.videoPlayer.pause();
    this.storeVideoTime();
  }

  storeVideoTime(): void {
    if (this.videoPlayer) {
      // eslint-disable-next-line prefer-const
      let timeVideo: number = this.videoPlayer.currentTime;
      localStorage.setItem(
        `season${seasonVideo}episode${episodeVideo}`,
        timeVideo.toString(),
      );
    }
  }
  progressVideo(): void {
    // eslint-disable-next-line prefer-const
    let progressBarVideo = document.querySelector(
      '.progress-bar',
    ) as HTMLInputElement;
    const targetVideo = document.querySelector('video');
    if (targetVideo) {
      const newTime = targetVideo.currentTime * (100 / targetVideo.duration);
      if (progressBarVideo) {
        progressBarVideo.value = newTime.toFixed(2).toString();

        progressBarVideo.style.backgroundSize = newTime.toFixed(2) + '% 100%';
      }
    }
  }

  mute(): void {
    const volumeBarValue = parseInt(this.volumeBar.value);
    if (volumeBarValue > 0) {
      this.videoPlayer.volume = 0;
      this.volumeBar.value = '0';
      this.volumeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    } else {
      this.videoPlayer.volume = 1;
      this.volumeBar.value = '10';
      this.volumeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    }
  }

  volumeVideo(): void {
    const volumeBarValue = parseInt(this.volumeBar.value);

    this.videoPlayer.volume = volumeBarValue / 10;

    if (volumeBarValue / 10 == 0) {
      this.volumeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';
    }

    if (volumeBarValue / 10 >= 0.1 && volumeBarValue / 10 <= 0.3) {
      this.volumeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/></svg>';
    }

    if (volumeBarValue / 10 >= 0.4 && volumeBarValue / 10 <= 0.7) {
      this.volumeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-1"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    }

    if (volumeBarValue / 10 >= 0.8) {
      this.volumeButton.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    }
  }

  iniciarEventos(): void {
    this.getParameter();

    if (this.playButton) {
      this.playButton.addEventListener('click', () => {
        this.playToggle();
      });
    }

    if (this.videoPlayer) {
      this.videoPlayer.addEventListener('click', () => {
        this.playToggle();
      });
      this.videoPlayer.addEventListener('timeupdate', () => {
        this.progressVideo();
        this.storeVideoTime();

        let curmins: number = Math.floor(this.videoPlayer.currentTime / 60);
        let cursecs: number = Math.floor(
          this.videoPlayer.currentTime - curmins * 60,
        );
        const durmins: number = Math.floor(this.videoPlayer.duration / 60);
        const dursecs: number = Math.floor(
          (this.videoPlayer.duration - durmins) * 60,
        );

        const cursecsFormatado = `0${cursecs}`;

        if (cursecs < 10) {
          this.currentVideoTime.innerHTML = `${curmins}:${cursecsFormatado}`;
        } else {
          this.currentVideoTime.innerHTML = `${curmins}:${cursecs}`;
        }

        if (cursecs > 60) {
          cursecs = 0;
          curmins += 1;
        }

        this.durationVideoTime.innerHTML = ` / ${durmins}:${dursecs
          .toString()
          .slice(0, 2)}`;

        if (
          Math.floor(this.videoPlayer.currentTime) ===
          Math.floor(this.videoPlayer.duration)
        ) {
          this.videoPlayer.currentTime = 0;
          nextVideo();
        }

        console.log(
          this.videoPlayer.currentTime,
          this.videoPlayer.duration - 100,
        );
        const durationForNext = this.videoPlayer.duration - 100;
        if (this.videoPlayer.currentTime > durationForNext) {
          this.nextButton.classList.add('active');
        }
      });
    }

    if (this.progressBar) {
      this.progressBar.addEventListener('change', () => {
        this.stop();
        const value: number = parseInt(this.progressBar.value);
        const changeTo = this.videoPlayer.duration * (value / 100);
        this.videoPlayer.currentTime = changeTo;

        this.playToggle();
      });
    }

    if (this.volumeButton) {
      this.volumeButton.addEventListener('click', () => {
        this.mute();
      });
    }

    if (this.volumeBar) {
      this.volumeBar.addEventListener('change', () => {
        this.volumeVideo();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', nextVideo);
    }
  }
}

const videoPlayer = new VideoPlayer({
  videoPlayer: document.querySelector('video') as HTMLVideoElement,
  playButton: document.getElementById('playButton') as HTMLButtonElement,
  progressBar: document.querySelector('.progress-bar') as HTMLInputElement,
  volumeButton: document.getElementById('volumeButton') as HTMLButtonElement,
  volumeBar: document.querySelector('.volume-bar') as HTMLInputElement,
  currentVideoTime: document.getElementById('current-time') as HTMLInputElement,
  durationVideoTime: document.getElementById(
    'duration-time',
  ) as HTMLInputElement,
  nextButton: document.getElementById('nextButton') as HTMLButtonElement,
});

videoPlayer.iniciarEventos();
populate();
