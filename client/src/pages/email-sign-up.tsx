import { Row, Col, Button, Grid } from '@freecodecamp/react-bootstrap';
import React, { useEffect, useRef } from 'react';
import Helmet from 'react-helmet';
import { TFunction, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { Dispatch } from 'redux';
import { createSelector } from 'reselect';
import IntroDescription from '../components/Intro/components/IntroDescription';
import createRedirect from '../components/create-redirect';
import { ButtonSpacer, Spacer } from '../components/helpers';
import { apiLocation } from '../../../config/env.json';

import { acceptTerms, userSelector, isSignedInSelector } from '../redux';

import './email-sign-up.css';
interface AcceptPrivacyTermsProps {
  acceptTerms: (accept: boolean | null) => void;
  acceptedPrivacyTerms: boolean;
  isSignedIn: boolean;
  t: TFunction;
}

const mapStateToProps = createSelector(
  userSelector,
  isSignedInSelector,
  (
    { acceptedPrivacyTerms }: { acceptedPrivacyTerms: boolean },
    isSignedIn: boolean
  ) => ({
    acceptedPrivacyTerms,
    isSignedIn
  })
);
const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ acceptTerms }, dispatch);
const RedirectToLearn = createRedirect('/learn');

function AcceptPrivacyTerms({
  acceptTerms,
  acceptedPrivacyTerms,
  isSignedIn,
  t
}: AcceptPrivacyTermsProps) {
  const acceptedPrivacyRef = useRef(acceptedPrivacyTerms);
  const acceptTermsRef = useRef(acceptTerms);

  useEffect(() => {
    acceptedPrivacyRef.current = acceptedPrivacyTerms;
    acceptTermsRef.current = acceptTerms;
  });

  useEffect(() => {
    return () => {
      // if a user navigates away from here we should set acceptedPrivacyTerms
      // to true (so they do not get pulled back) without changing their email
      // preferences (hence the null payload)
      // This makes sure that the user has to opt in to Quincy's emails and that
      // they are only asked twice
      if (!acceptedPrivacyRef.current) {
        acceptTermsRef.current(null);
      }
    };
  }, []);

  function onClick(isWeeklyEmailAccepted: boolean) {
    acceptTerms(isWeeklyEmailAccepted);
  }

  function renderEmailListOptin(isSignedIn: boolean) {
    if (isSignedIn) {
      return (
        <Row>
          <Col md={4} mdOffset={2} sm={5} smOffset={1} xs={12}>
            <Button
              block={true}
              bsSize='lg'
              bsStyle='primary'
              className='big-cta-btn'
              onClick={() => onClick(true)}
            >
              {t('buttons.yes-please')}
            </Button>
            <ButtonSpacer />
          </Col>
          <Col md={4} sm={5} xs={12}>
            <Button
              block={true}
              bsSize='lg'
              bsStyle='primary'
              className='big-cta-btn'
              onClick={() => onClick(false)}
            >
              {t('buttons.no-thanks')}
            </Button>
            <ButtonSpacer />
          </Col>
        </Row>
      );
    } else {
      return (
        <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
          <ButtonSpacer />
          <Button
            block={true}
            bsSize='lg'
            bsStyle='primary'
            className='big-cta-btn'
            href={`${apiLocation}/signin`}
          >
            {t('buttons.sign-up-email-list')}
          </Button>
          <ButtonSpacer />
        </Col>
      );
    }
  }

  return acceptedPrivacyTerms ? (
    <RedirectToLearn />
  ) : (
    <>
      <Helmet>
        <title>{t('misc.email-signup')} | freeCodeCamp.org</title>
      </Helmet>
      <Grid>
        <Row>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <Spacer />
            <IntroDescription />
            <hr />
          </Col>
        </Row>
        <Row className='email-sign-up' data-cy='email-sign-up'>
          <Col md={8} mdOffset={2} sm={10} smOffset={1} xs={12}>
            <strong>{t('misc.quincy')}</strong>
            <Spacer />
            <p>{t('misc.email-blast')}</p>
            <Spacer />
          </Col>
          {renderEmailListOptin(isSignedIn)}
          <Col xs={12}>
            <Spacer />
          </Col>
        </Row>
      </Grid>
    </>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AcceptPrivacyTerms));
