import { H3, ListItem } from "native-base";
import * as React from "react";
import {
  ListRenderItemInfo,
  RefreshControl,
  SectionListData
} from "react-native";
import { NavigationInjectedProps } from "react-navigation";
import { connect } from "react-redux";

import I18n from "../../i18n";

import { ServicePublic } from "../../../definitions/backend/ServicePublic";

import { contentServiceLoad } from "../../store/actions/content";
import { Dispatch, ReduxProps } from "../../store/actions/types";
import { ProfileState } from "../../store/reducers/profile";
import { GlobalState } from "../../store/reducers/types";

import { isDefined } from "../../utils/guards";

import { ServiceId } from "../../../definitions/backend/ServiceId";
import TopScreenComponent from "../../components/screens/TopScreenComponent";
import { ServiceListItem } from "../../components/services/ServiceListItem";
import Markdown from "../../components/ui/Markdown";
import { SectionList } from "../../components/ui/SectionList";
import { navigateToServiceDetailsScreen } from "../../store/actions/navigation";
import { loadVisibleServicesRequest } from "../../store/actions/services";
import * as pot from "../../types/pot";
import { InferNavigationParams } from "../../types/react";
import ServiceDetailsScreen from "./ServiceDetailsScreen";

type ReduxMappedStateProps = Readonly<{
  profile: ProfileState;
  isLoading: boolean;
  // tslint:disable-next-line:readonly-array
  sections: Array<SectionListData<pot.Pot<ServicePublic, Error>>>;
}>;

type ReduxMappedDispatchProps = Readonly<{
  loadVisibleServices: () => void;
  contentServiceLoad: (serviceId: ServiceId) => void;
  navigateToServiceDetailsScreen: (
    params: InferNavigationParams<typeof ServiceDetailsScreen>
  ) => void;
}>;

type OwnProps = NavigationInjectedProps;

type Props = ReduxMappedStateProps &
  ReduxMappedDispatchProps &
  ReduxProps &
  OwnProps;

class ServicesScreen extends React.Component<Props> {
  private goBack = () => this.props.navigation.goBack();

  private getServiceKey = (
    potService: pot.Pot<ServicePublic, Error>,
    index: number
  ): string => {
    return pot.getOrElse(
      pot.map(
        potService,
        service => `${service.service_id}-${service.version || 0}`
      ),
      `service-pot-${index}`
    );
  };

  private renderServiceSectionHeader = (info: {
    section: SectionListData<pot.Pot<ServicePublic, Error>>;
  }): React.ReactElement<any> | null => (
    <ListItem itemHeader={true}>
      <H3>{info.section.title}</H3>
    </ListItem>
  );

  private onServiceSelect = (service: ServicePublic) => {
    // when a service gets selected, before navigating to the service detail
    // screen, we issue a contentServiceLoad to refresh the service metadata
    this.props.contentServiceLoad(service.service_id);
    this.props.navigateToServiceDetailsScreen({
      service
    });
  };

  private renderServiceItem = (
    itemInfo: ListRenderItemInfo<pot.Pot<ServicePublic, Error>>
  ) => (
    <ServiceListItem
      item={itemInfo.item}
      profile={this.props.profile}
      onSelect={this.onServiceSelect}
    />
  );

  public componentDidMount() {
    // on mount, update visible services
    this.props.loadVisibleServices();
  }

  public render() {
    return (
      <TopScreenComponent
        title={I18n.t("services.title")}
        goBack={this.goBack}
        subtitle={I18n.t("services.subTitle")}
        contextualHelp={{
          title: I18n.t("services.title"),
          body: () => <Markdown>{I18n.t("services.servicesHelp")}</Markdown>
        }}
      >
        <SectionList
          sections={this.props.sections}
          renderItem={this.renderServiceItem}
          renderSectionHeader={this.renderServiceSectionHeader}
          keyExtractor={this.getServiceKey}
          stickySectionHeadersEnabled={false}
          alwaysBounceVertical={false}
          withContentLateralPadding={true}
          refreshing={this.props.isLoading}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isLoading}
              onRefresh={this.props.loadVisibleServices}
            />
          }
        />
      </TopScreenComponent>
    );
  }
}

const mapStateToProps = (state: GlobalState): ReduxMappedStateProps => {
  const { services, organizations } = state.entities;

  const orgfiscalCodes = Object.keys(services.byOrgFiscalCode);

  // tslint:disable-next-line:readonly-array
  const sections = orgfiscalCodes.map(fiscalCode => {
    const title = organizations[fiscalCode] || fiscalCode;
    const serviceIdsForOrg = services.byOrgFiscalCode[fiscalCode] || [];
    const data = serviceIdsForOrg
      .map(id => services.byId[id])
      .filter(isDefined);
    return {
      title,
      data
    };
  });

  const isAnyServiceLoading =
    Object.keys(services.byId).find(k => {
      const oneService = services.byId[k];
      return oneService !== undefined && pot.isLoading(oneService);
    }) !== undefined;

  const isLoading =
    pot.isLoading(state.entities.services.visible) || isAnyServiceLoading;

  return {
    profile: state.profile,
    sections,
    isLoading
  };
};

const mapDispatchToProps = (dispatch: Dispatch): ReduxMappedDispatchProps => ({
  loadVisibleServices: () => dispatch(loadVisibleServicesRequest()),
  contentServiceLoad: (serviceId: ServiceId) =>
    dispatch(contentServiceLoad(serviceId)),
  navigateToServiceDetailsScreen: (
    params: InferNavigationParams<typeof ServiceDetailsScreen>
  ) => dispatch(navigateToServiceDetailsScreen(params))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServicesScreen);
