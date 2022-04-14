interface EpisodesList {
  title: string;
  seasons: Season[];
}

interface Season {
  identifier: number;
  videoFormat: string;
  episodesLink: Episodes[];
}

interface Episodes {
  [key: string]: string;
}

export let season: string;
export let episode: string;
export let episodesList: EpisodesList;
export let currentTimeOnLoad: string;

const playBtn = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

export async function populate(): Promise<EpisodesList> {
  const requestURL = '../json/pokemon.json';
  const request = new Request(requestURL);

  const response = await fetch(request);
  const episodesListText = await response.text();

  episodesList = JSON.parse(episodesListText);

  populateEpisodes(episodesList);
  setVideo(episodesList);

  return episodesList;
}

const populateEpisodes = (serie: EpisodesList) => {
  const serieTitle = document.querySelector('.serie-title') as HTMLElement;
  serieTitle ? (serieTitle.innerText = serie.title) : null;

  serie.seasons.map((season, index) => {
    const seasonList = document.querySelector('.season') as HTMLElement;
    const ul = document.createElement('ul');
    seasonList ? seasonList.append(ul) : null;
    for (const episode of season.episodesLink) {
      for (const ep in episode) {
        const li = document.createElement('li');
        if (localStorage.getItem(`season${index + 1}episode${ep}`) !== null) {
          li.classList.add('in-progress');
        }
        ul.append(li);
        const anchor = document.createElement('a');
        anchor.setAttribute(
          'href',
          `video.html?season=${index + 1}?episodes=${ep}`,
        );
        li.append(anchor);
        const titleEpisode = document.createTextNode(episode[ep]);
        const span = document.createElement('span');
        span.innerHTML =
          "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-play'><polygon points='5 3 19 12 5 21 5 3'/></svg>";
        anchor.append(titleEpisode);
        anchor.append(span);
      }
    }
  });
};

const getParameter = (): string => {
  // eslint-disable-next-line prefer-const
  season = window.location.href.substring(
    window.location.href.indexOf('season=') + 7,
  )[0];
  episode = window.location.href.substring(
    window.location.href.indexOf('episodes=') + 9,
  );

  const brayer = document.getElementById('brayer') as HTMLVideoElement;
  if (localStorage.getItem(`season${season}episode${episode}`) !== null) {
    brayer.currentTime = parseInt(
      localStorage.getItem(`season${season}episode${episode}`) as string,
    );
  }
  return season;
};

function setVideo(obj: EpisodesList): void {
  const brayer = document.getElementById('brayer') as HTMLVideoElement;

  getParameter();
  if (brayer != null) {
    const episodeListLink = obj.seasons[parseInt(season) - 1].episodesLink[0];
    for (const ep in episodeListLink) {
      if (ep === episode) {
        const source = document.createElement('source');
        const format = obj.seasons[parseInt(season) - 1].videoFormat;
        const title = obj.title
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        source.setAttribute(
          'src',
          `/dist/assets/videos/${title}/${
            obj.seasons[parseInt(season) - 1].identifier
          }/${ep}.${format}`,
        );

        source.setAttribute('type', `video/${format}`);
        brayer.append(source);
      }
    }
  }
}

export async function nextVideo(): Promise<void> {
  getParameter();
  const actualSeason = parseInt(season);
  const actualEpisode = parseInt(episode);
  const totalSeasons = episodesList.seasons.length;
  const totalEpisodes = Object.keys(
    episodesList.seasons[0].episodesLink[0],
  ).length;

  if (actualEpisode < totalEpisodes) {
    const actualEpisodeSum = actualEpisode + 1;
    window.location.replace(
      `/video.html?season=${actualSeason}?episodes=00${actualEpisodeSum}`,
    );
    populate();
  }

  if (actualEpisode > totalSeasons) {
    console.log(actualSeason, totalSeasons);
    const actualSeasonSum = actualSeason + 1;
    const actualEpisodeSum = 1;
    window.location.replace(
      `/video.html?season=${actualSeasonSum}?episodes=00${actualEpisodeSum}`,
    );
    populate();
  }
  // if (parseInt(getParameter()) < totalSeasons) {
  //   const newSeason = parseInt(getParameter()) + 1;
  //   console.log(newSeason);
  // }
}
