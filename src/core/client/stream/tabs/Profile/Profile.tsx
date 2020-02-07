import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { graphql, useLocal } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import UserBoxContainer from "coral-stream/common/UserBox";
import { SetProfileTabEvent } from "coral-stream/events";
import {
  HorizontalGutter,
  Tab,
  TabBar,
  TabContent,
  TabPane,
} from "coral-ui/components";

import { ProfileLocal } from "coral-stream/__generated__/ProfileLocal.graphql";

import DeletionRequestCalloutContainer from "./DeletionRequest/DeletionRequestCalloutContainer";
import MyCommentsContainer from "./MyComments";
import PreferencesContainer from "./Preferences";
import AccountSettingsContainer from "./Settings";

// import NotificationSettingsContainer from "./Preferences/NotificationSettingsContainer";

export interface ProfileProps {
  story: PropTypesOf<typeof MyCommentsContainer>["story"];
  viewer: PropTypesOf<typeof UserBoxContainer>["viewer"] &
    PropTypesOf<typeof MyCommentsContainer>["viewer"] &
    PropTypesOf<typeof AccountSettingsContainer>["viewer"] &
    PropTypesOf<typeof DeletionRequestCalloutContainer>["viewer"] &
    PropTypesOf<typeof PreferencesContainer>["viewer"];
  settings: PropTypesOf<typeof UserBoxContainer>["settings"] &
    PropTypesOf<typeof AccountSettingsContainer>["settings"] &
    PropTypesOf<typeof MyCommentsContainer>["settings"];
}

const Profile: FunctionComponent<ProfileProps> = props => {
  const emitSetProfileTabEvent = useViewerEvent(SetProfileTabEvent);
  const [local, setLocal] = useLocal<ProfileLocal>(graphql`
    fragment ProfileLocal on Local {
      profileTab
    }
  `);
  const onTabClick = useCallback(
    (tab: ProfileLocal["profileTab"]) => {
      if (local.profileTab !== tab) {
        emitSetProfileTabEvent({ tab });
        setLocal({ profileTab: tab });
      }
    },
    [setLocal, local.profileTab]
  );
  return (
    <HorizontalGutter size="double">
      <UserBoxContainer viewer={props.viewer} settings={props.settings} />
      <TabBar
        variant="secondary"
        activeTab={local.profileTab}
        onTabClick={onTabClick}
        className={CLASSES.tabBarMyProfile.$root}
      >
        <Tab tabID="MY_COMMENTS" className={CLASSES.tabBarMyProfile.myComments}>
          <Localized id="profile-myCommentsTab-comments">
            <span>My comments</span>
          </Localized>
        </Tab>
        <Tab
          tabID="PREFERENCES"
          className={CLASSES.tabBarMyProfile.preferences}
        >
          <Localized id="profile-preferencesTab">
            <span>Preferences</span>
          </Localized>
        </Tab>
        <Tab tabID="ACCOUNT" className={CLASSES.tabBarMyProfile.settings}>
          <Localized id="profile-accountTab">
            <span>Account</span>
          </Localized>
        </Tab>
      </TabBar>
      <TabContent activeTab={local.profileTab}>
        <TabPane
          className={CLASSES.myCommentsTabPane.$root}
          tabID="MY_COMMENTS"
        >
          <MyCommentsContainer
            settings={props.settings}
            viewer={props.viewer}
            story={props.story}
          />
        </TabPane>
        <TabPane
          className={CLASSES.notificationsTabPane.$root}
          tabID="PREFERENCES"
        >
          <PreferencesContainer viewer={props.viewer} />
        </TabPane>
        <TabPane className={CLASSES.accountTabPane.$root} tabID="ACCOUNT">
          <AccountSettingsContainer
            viewer={props.viewer}
            settings={props.settings}
          />
          <DeletionRequestCalloutContainer viewer={props.viewer} />
        </TabPane>
      </TabContent>
    </HorizontalGutter>
  );
};

export default Profile;
