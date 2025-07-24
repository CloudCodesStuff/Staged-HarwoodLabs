import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
}

const baseUrl = 'https://stagedhq.io';

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Staged - The modern client portal.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img alt="Staged" height="40" src={`${baseUrl}/logo.png`} width="40" />
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          Welcome to Staged, the best way to manage your client projects, share
          deliverables, and get feedback, all in one place.
        </Text>
        <Section style={btnContainer}>
          <Button href={`${baseUrl}/dashboard`} style={button}>
            Go to Your Dashboard
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Staged Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Arc Labs LLC</Text>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const logo = {
  margin: '0 auto',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#FC3200',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
