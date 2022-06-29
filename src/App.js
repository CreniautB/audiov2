import React, { useEffect, useState, useRef } from "react";
import Header from "./components/header/header";
import Background from "./components/background/background";
import "./App.css";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import { Helmet } from "react-helmet";

function App() {
  const [data, setData] = useState();
  const [currentStatus, setCurrentStatus] = useState();
  const [src, setSrc] = useState();
  const [musicName, setMusicName] = useState();
  const [indexMusic, setIndexMusic] = useState(0);
  const [videoSrc, setVideoSrc] = useState();
  const [reload, setReload] = useState(false);

  const [onAir, setOnAir] = useState(true);

  const player = useRef();
  const url = "https://back.testbenjaminc.fr/";

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await fetch(
        `https://back.testbenjaminc.fr/api/playlists?populate=*`
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
    if (player.current !== undefined && currentStatus !== undefined) {
      startPlayer();
    }
  }, [reload]);

  function getTheStatus(data) {
    setIndexMusic(0);
    const hour = new Date().getHours();
    let night;
    data.forEach((element, index) => {
      console.log(index);
      if (element.attributes.name === "nuit") {
        night = element;
      }
      if (
        hour >= element.attributes.minTime &&
        hour < element.attributes.maxTime
      ) {
        let newDatas = randomize(element);
        setCurrentStatus(newDatas);
        setReload(!reload);
        setVideoSrc(url + element.attributes.background.data.attributes.url);
        setOnAir(true);
        return;
      } else {
        if (index === 2) {
          let newDatas = randomize(night);
          setCurrentStatus(newDatas);
          setReload(!reload);
          setVideoSrc(url + night.attributes.background.data.attributes.url);
          setOnAir(true);
        }
      }
    });
  }

  function switchStatus(e, status) {
    setOnAir(false);
    setIndexMusic(0);
    document.querySelectorAll(".headerTitle").forEach((elem) => {
      elem.classList.remove("activeTitle");
    });
    e.target.classList.add("activeTitle");
    data.forEach((element) => {
      if (status === "all") {
        getTheStatus(data);
        return;
      }
      if (element.attributes.name === status) {
        let newDatas = randomize(element);
        setCurrentStatus(newDatas);
        setReload(!reload);
        setVideoSrc(url + element.attributes.background.data.attributes.url);
        return;
      }
    });
  }

  function randomize(dataSet) {
    let list = dataSet.attributes.musique.data.map((value, index) => index);
    list = list.sort(() => Math.random() - 0.5);
    const results = list.map(
      (number) => dataSet.attributes.musique.data[number]
    );
    return results;
  }

  function startPlayer() {
    let secondPartSrc = currentStatus[indexMusic].attributes.url;
    setSrc(url + secondPartSrc);
    setMusicName(currentStatus[indexMusic].attributes.name);
  }

  function nextMusic() {
    if (indexMusic >= currentStatus.length - 1) {
      setIndexMusic(0);
    } else {
      setIndexMusic(indexMusic + 1);
    }

    let secondPartSrc = currentStatus[indexMusic].attributes.src;
    setSrc(url + secondPartSrc);
    setMusicName(currentStatus[indexMusic].attributes.name);
    setReload(!reload);
  }

  function previousMusic(e) {
    setIndexMusic(indexMusic - 1);
    console.log(indexMusic);
    let secondPartSrc = currentStatus[indexMusic].attributes.src;
    setSrc(url + secondPartSrc);
    setMusicName(currentStatus[indexMusic].attributes.name);
    setReload(!reload);
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Maison Palmier</title>
      </Helmet>
      <Header switchStatus={switchStatus} />
      {currentStatus == undefined ? (
        <></>
      ) : (
        <>
          <Background videoSrc={videoSrc} />
          <div className="audioContainer">
            {onAir ? (
              <AudioPlayer
                ref={player}
                showSkipControls={false}
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
            ) : (
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
            )}
            <div className="musicName">
              {musicName ? (
                <p>
                  {musicName
                    .replace(/ *\([^)]*\) */g, "")
                    .replace("MPJournée", "")
                    .replace("MPMatinée", "")
                    .replace("MPSoirée", "")
                    .replace(".mp3", "")
                    .replace(/[\[\]']+/g, "")
                    .replace("-", " ")
                    .replace("_", " ")
                    .replace("MPSoirée -", " ")}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
