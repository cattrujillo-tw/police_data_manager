import styles from "../../../../common/globalStyling/styles";
import { Card, CardContent, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import _ from "lodash";
import TextTruncate from "../../../shared/components/TextTruncate";

const CaseDetailCard = props => {
  const { cardData, cardTitle } = props;

  const renderComplainantWitnessOfficerData = () => {
    return cardData.map(data => {
      if (data) {
        return renderCardData(data);
      } else return null;
    });
  };

  const renderCardData = data => {
    return (
      <div data-testid={"caseDetailCardItem"} key={cardData.indexOf(data)}>
        <br />
        {_.isObject(data) ? (
          Object.keys(data).map(key => {
            return (
              <Typography key={Object.keys(data).indexOf(key)}>
                {key}:{" "}
                {data[key] ? (
                  data[key]
                ) : (
                  <span style={{ fontStyle: "italic", color: "grey" }}>
                    Not specified
                  </span>
                )}
              </Typography>
            );
          })
        ) : (
          <Typography style={{ fontStyle: "italic", color: "grey" }}>
            {data}
          </Typography>
        )}
      </div>
    );
  };

  function narrativeDetailsData(strippedNarrDetails) {
    if (strippedNarrDetails) {
      return (
        <Fragment>
          <br />
          <div dangerouslySetInnerHTML={{ __html: cardData.props.message }} />
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <br />
          <Typography style={{ fontStyle: "italic", color: "grey" }}>
            Not specified
          </Typography>
        </Fragment>
      );
    }
  }

  const renderNarrativeData = cardTitle => {
    if (cardTitle === "Narrative Details" && cardData.props.message) {
      const regex = /(<([^>]+)>)/gi;
      const strippedNarrDetails = cardData.props.message.replace(regex, "");

      return narrativeDetailsData(strippedNarrDetails);
    } else {
      return (
        <Fragment>
          <br />
          {cardData}
        </Fragment>
      );
    }
  };

  const renderAllegationSection = () => {
    return (
      <Fragment>
        <br />
        <Typography style={styles.section}>{props.cardSecondTitle}</Typography>
        {props.allegations.length === 0 ? (
          <Fragment>
            <br />
            <Typography style={{ fontStyle: "italic", color: "grey" }}>
              No allegations have been added
            </Typography>
          </Fragment>
        ) : (
          props.allegations.map(allegation => {
            return renderAllegationData(allegation);
          })
        )}
      </Fragment>
    );
  };

  const renderAllegationData = allegation => {
    return (
      <div
        data-testid="caseDetailCardAllegation"
        key={props.allegations.indexOf(allegation)}
      >
        <br />
        {Object.keys(allegation).map((key, index) => {
          return key === "Allegation Details" ? (
            <TextTruncate
              key={index}
              testLabel={"letterReviewAllegationDetails"}
              message={
                allegation[key] ? `${key}: ${allegation[key]}` : `${key}: N/A`
              }
            />
          ) : (
            <Typography key={Object.keys(allegation).indexOf(key)}>
              {key}: {allegation[key] ? allegation[key] : "N/A"}
            </Typography>
          );
        })}
      </div>
    );
  };

  return (
    <Card
      style={{
        backgroundColor: "white",
        margin: "0 0 32px 0"
      }}
    >
      <CardContent
        data-testid={"caseDetailCard"}
        style={{ paddingBottom: "16px" }}
      >
        <Typography style={styles.section}>{cardTitle}</Typography>
        {_.isArray(cardData)
          ? renderComplainantWitnessOfficerData()
          : renderNarrativeData(cardTitle)}
        {props.cardSecondTitle ? renderAllegationSection() : null}
      </CardContent>
    </Card>
  );
};

export default CaseDetailCard;
