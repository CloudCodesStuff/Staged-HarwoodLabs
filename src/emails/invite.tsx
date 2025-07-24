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
  
  interface InviteToProjectEmailProps {
    inviteeEmail: string;
    projectName: string;
    portalId: string;
  }
  
  const baseUrl = 'https://stagedhq.io';
  
  export const InviteToProjectEmail = ({
    inviteeEmail,
    projectName,
    portalId,
  }: InviteToProjectEmailProps) => (
      <Html>
        <Head />
      <Preview>You've been invited to the {projectName} portal</Preview>
      <Body style={main}>
        <Container style={container}>
                <Img
            src={`${baseUrl}/logo.png`}
                  width="40"
            height="40"
            alt="Staged"
            style={logo}
          />
          <Text style={paragraph}>Hello,</Text>
          <Text style={paragraph}>
            You've been invited to join the <strong>{projectName}</strong> project portal on Staged. Use the button below to access it using your email: <strong>{inviteeEmail}</strong>.
              </Text>
          <Section style={btnContainer}>
            <Button style={button} href={`${baseUrl}/portal/${portalId}`}>
              View Your Project
                </Button>
              </Section>
          <Text style={paragraph}>
            If you weren't expecting this, you can ignore this message.
              </Text>
          <Hr style={hr} />
          <Text style={footer}>Arc Labs LLC</Text>
            </Container>
          </Body>
      </Html>
    );
  
  export default InviteToProjectEmail;
  
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
    color: '#000',
  };
  
  const btnContainer = {
    textAlign: 'center' as const,
    marginTop: '24px',
  };
  
  const button = {
    backgroundColor: '#FC3200',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px',
  };
  
  const hr = {
    borderColor: '#cccccc',
    margin: '20px 0',
  };
  
  const footer = {
    color: '#8898aa',
    fontSize: '12px',
  };
  