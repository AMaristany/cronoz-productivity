
import React from "react";
import Layout from "../components/Layout";
import ActivityList from "../components/ActivityList";

const Index: React.FC = () => {
  return (
    <Layout title="Cronómetro">
      <ActivityList />
    </Layout>
  );
};

export default Index;
