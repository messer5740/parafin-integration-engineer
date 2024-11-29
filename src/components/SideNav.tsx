import React from "react";
import styled from "styled-components";
import { partnerColor, partnerColorAlpha } from "./Header.tsx";

export const SideNav = ({ onFundAccount }) => {
  return (
    <SideNavShell>
      <StyledSideNav>
        {/* Send Offer Button */}
        <StyledNavItem onClick={() => alert("Send Offer clicked!")}>
          Send Offer
        </StyledNavItem>

        {/* Changed "Verify Bank Account" to "Fund Account" */}
        <StyledNavItem onClick={onFundAccount}>
          Fund Account
        </StyledNavItem>
      </StyledSideNav>
    </SideNavShell>
  );
};

// Styled Components
const SideNavShell = styled.div`
  display: flex;
  align-items: flex-start;
  height: 100%;
  padding: 20px;
  background-color: #f9f9f9;
`;

const StyledSideNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledNavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${partnerColor};
  background-color: ${partnerColorAlpha};
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
