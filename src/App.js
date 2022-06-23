import React, { useEffect, useState, useRef } from "react";
import Header from "./components/header/header";
import Background from "./components/background/background";
import "./App.css";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";

function App() {
  const [data, setData] = useState();
  const [currentStatus, setCurrentStatus] = useState();
  const [src, setSrc] = useState();
  const [musicName, setMusicName] = useState();
  const [indexMusic, setIndexMusic] = useState(0);
  const [randomizeData, setRandomizeData] = useState();
  const [videoSrc, setVideoSrc] = useState();
  const [reload, setReload] = useState(false);

  const player = useRef();
  const url = "http://13.38.89.2:1337";

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await fetch(
        `http://13.38.89.2:1337/api/playlists?populate=*`,
        {}
      );
      response = await response.json();
      setData(response.data);
      setReload(!reload);
      return response.data;
    }
    fetchMyAPI().then((data) => {
      getTheStatus(data);
    });
  }, []);

  useEffect(() => {
    console.log(reload);
    if (player.current !== undefined && currentStatus !== undefined) {
      startPlayer();
    }
  }, [reload]);

  function getTheStatus(data) {
    const hour = new Date().getHours();
    data.forEach((element) => {
      if (
        hour >= element.attributes.mintime &&
        hour < element.attributes.maxtime
      ) {
        setCurrentStatus(element);
        setReload(!reload);
        setVideoSrc(url + element.attributes.background.data.attributes.url);

        return;
      }
    });
  }

  function switchStatus(e, status) {
    document.querySelectorAll(".headerTitle").forEach((elem) => {
      elem.classList.remove("activeTitle");
    });
    e.target.classList.add("activeTitle");
    data.forEach((element) => {
      if (element.attributes.name === status) {
        setCurrentStatus(element);
        setReload(!reload);
        setVideoSrc(url + element.attributes.background.data.attributes.url);
        return;
      }
      if (status === "all") {
        getTheStatus(data);
      }
    });
  }

  function randomize() {
    let list = currentStatus.attributes.music.data.map((value, index) => index);
    list = list.sort(() => Math.random() - 0.5);
    const results = list.map(
      (number) => currentStatus.attributes.music.data[number]
    );
    return results;
  }

  function startPlayer() {
    let results = randomize();
    setRandomizeData(results);
    let secondPartSrc = results[indexMusic].attributes.src;
    setIndexMusic(0);
    setSrc(url + secondPartSrc);
    setMusicName(results[indexMusic].attributes.name);
  }

  function nextMusic() {
    if (indexMusic >= randomizeData.length - 1) {
      setIndexMusic(0);
    } else {
      setIndexMusic(indexMusic + 1);
    }

    let secondPartSrc = randomizeData[indexMusic].attributes.src;
    setSrc(url + secondPartSrc);
    setMusicName(randomizeData[indexMusic].attributes.name);
    setReload(!reload);
  }

  function previousMusic(e) {
    setIndexMusic(indexMusic - 1);
    let secondPartSrc = randomizeData[indexMusic].attributes.src;
    setSrc(url + secondPartSrc);
    setMusicName(randomizeData[indexMusic].attributes.name);
  }

  return (
    <>
      <Header switchStatus={switchStatus} />
      {currentStatus == undefined ? (
        <></>
      ) : (
        <>
          <Background videoSrc={videoSrc} />
          <div className="audioContainer">
            {/* <h1>{player.current.audio.current.currentTime}</h1>
            <h1>{player.current.audio.current.duration}</h1> */}

            <AudioPlayer
              ref={player}
              showSkipControls={true}
              showJumpControls={false}
              autoPlay
              src={src}
              onClickNext={(e) => nextMusic(e)}
              onClickPrevious={(e) => previousMusic(e)}
              onEnded={(e) => nextMusic(e)}
              customProgressBarSection={[
                RHAP_UI.PROGRESS_BAR,
                RHAP_UI.CURRENT_TIME,
                <div className="separatorTime">:</div>,
                RHAP_UI.DURATION,
              ]}
            />
            <div className="musicName">
              <p>{musicName}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
