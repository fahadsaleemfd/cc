import React from "react";
import { graphql } from "gatsby";
import { Container } from "theme-ui";
import Layout from "@solid-ui-layout/Layout";
import Seo from "@solid-ui-components/Seo";
import Divider from "@solid-ui-components/Divider";
import ModalWithTabs from "@solid-ui-blocks/Modal/Block01";
import ModalSimple from "@solid-ui-blocks/Modal/Block02";
import Header from "@solid-ui-blocks/Header/Block01";
import Content from "@solid-ui-blocks/Content/Block02";
import Gallery from "@solid-ui-blocks/Blog/Block01";
import Contact from "@solid-ui-blocks/CallToAction/Block02";
import Footer from "@solid-ui-blocks/Footer/Block01";
import { normalizeBlockContentNodes } from "@blocks-helpers";
import styles from "./_styles";

const ServicesPage = (props) => {
  const { allBlockContent } = props.data;
  const content = normalizeBlockContentNodes(allBlockContent?.nodes);

  return (
    <Layout {...props}>
      <Seo title="Services | the hpl company" />
      {/* Modals */}
      <ModalWithTabs content={content["contact"]} />
      <ModalSimple content={content["termsofuse"]} />
      {/* Blocks */}
      <Header content={content["header"]} />
      <Divider space="5" />
      <Container variant="wide" sx={styles.heroContainer}>
        <Content content={content["hero"]} />
        <Divider space="3" />
        <Gallery content={content["gallery"]} />
      </Container>
      <Divider space="5" />
      <Divider space="5" />
      <Content content={content["services-intro"]} />
      <Divider space="4" />
      <Content content={content["services"]} />
      <Divider space="4" />
      <Contact content={content["cta"]} />
      <Divider space="5" />
      <Footer content={content["footer"]} />
    </Layout>
  );
};

export const query = graphql`
  query innerpageServicesBlockContent {
    allBlockContent(filter: { page: { in: ["site/services", "shared"] } }) {
      nodes {
        ...BlockContent
      }
    }
  }
`;

export default ServicesPage;
