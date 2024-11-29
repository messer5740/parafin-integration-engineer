import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { ParafinWidget } from "@parafin/react";
import { Header } from "./components/Header.tsx";

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const isDevEnvironment = false;

    const fetchToken = async () => {
      const personId = "person_78d31247-840d-4e58-b80c-099e9cbf3a18";

      const response = await axios.get(
        `/parafin/token/${personId}/${isDevEnvironment}`
      );
      setToken(response.data.parafinToken);
    };

    if (!token) {
      fetchToken();
    }
  }, [token]);

  const onOptIn = async () => ({
    businessExternalId: "person_78d31247-840d-4e58-b80c-099e9cbf3a18",
    legalBusinessName: "Hearty Kitchens LLC",
    dbaName: "Hearty Kitchens",
    ownerFirstName: "Ralph",
    ownerLastName: "Furman",
    accountManagers: [
      {
        name: "Vineet Goel",
        email: "test1@parafin.com",
      },
    ],
    routingNumber: "121141822",
    accountNumberLastFour: "6789",
    bankAccountCurrencyCode: "USD",
    email: "test2@parafin.com",
    phoneNumber: "2026331000",
    address: {
      addressLine1: "301 Howard St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "USA",
    },
  });

  if (!token) {
    return <LoadingShell>loading...</LoadingShell>;
  }

  return (
    <div>
      <Header />
      <ContentShell>
        <PageShell>
          <ParafinWidget
            token={token}
            product="capital"
            externalBusinessId={undefined}
            onOptIn={onOptIn}
          />
        </PageShell>
      </ContentShell>
    </div>
  );
}

export default App;

const ContentShell = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingShell = styled.div`
  padding: 20px;
`;

const PageShell = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 40px;
  max-width: 1100px;
`;
