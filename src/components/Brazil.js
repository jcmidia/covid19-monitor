import React from "react";
import * as d3 from "d3";
import Stats from "../components/Stats";
import useStats from "../hooks/useStats";
import { TwoCols, Row, Separator } from "./StyledStats";
import acronymous from "../db/acronymous";

export default function Brazil() {
  const { stats } = useStats(
    "https://brasil.io/api/dataset/covid19/caso/data?format=json"
  );
  const statesData = {};

  if (stats) {
    Object.keys(acronymous).forEach((key) => {
      statesData[key] = {
        id: key,
        name: acronymous[key],
        confirmed: null,
        deaths: null,
      }
    })

    stats.results.forEach((city) => {
      const stateIndex = city.state.toUpperCase();
      
      if (city.is_last) {
        if (city.place_type === 'state') {
          statesData[stateIndex].confirmed = city.confirmed;
          statesData[stateIndex].deaths = city.deaths;
        }
      }
    });
  }

  const maxConfirmed = Math.max.apply(
    Math,
    Object.values(statesData).map(o => o.confirmed)
  );

  const colorScale = d3
    .scaleLinear()
    .range(["#ffc2c2", "#860000"])
    .domain([0, maxConfirmed/2, maxConfirmed])
    .interpolate(d3.interpolateLab);

  return (
    <>
      <Stats url="https://covid19.mathdro.id/api/countries/brazil" />
      <br />
      <h4>Estados / Confirmados</h4>
      <br />
      <TwoCols>
        {statesData &&
          Object.values(statesData)
            .sort((a, b) => {
              return b.confirmed - a.confirmed;
            })
            .map(province => (
              <Row key={province.id} style={{color: colorScale(province.confirmed)}}>
                <span>{province.name}</span>
                <Separator />
                <span>{province.confirmed || 'ND'}</span>
              </Row>
            ))}
      </TwoCols>
      <hr />
    </>
  );
}
