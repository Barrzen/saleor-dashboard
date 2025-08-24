import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import Check from "./FancyBoard/Check.js";
import FancyBoard from "./FancyBoard/FancyBoard";
import { WelcomePageSidebar } from "./WelcomePageSidebar";
import { WelcomePageTitle } from "./WelcomePageTitle";

export const WelcomePage = () => {
  const { channel, setChannel } = useAppChannel(false);
  const { user } = useUser();
  const channels = user?.accessibleChannels ?? [];
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  return (
    <Box
      display="grid"
      gap={7}
      gridTemplateColumns={{
        mobile: 1,
        tablet: 1,
        desktop: 3,
      }}
      paddingX={8}
      paddingY={6}
      paddingTop={9}
      __gridTemplateRows="auto 1fr"
    >
      <Box gridRowStart="1" __grid-column="1/-1">
        <WelcomePageTitle />
      </Box>
      <Box
        gridColumn={{
          mobile: "1",
          tablet: "1",
          desktop: "2",
        }}
      >
        <Check />
        <FancyBoard />

        <h1>Can i show something here? Yes you can show a fancy dashboard here</h1>
      </Box>
      <Box gridColumn="1">
        <WelcomePageSidebar
          channel={channel}
          setChannel={setChannel}
          channels={channels}
          hasPermissionToManageOrders={hasPermissionToManageOrders}
        />
      </Box>
    </Box>
  );
};
