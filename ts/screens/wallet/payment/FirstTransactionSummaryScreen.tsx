/**
 * This screen shows the transaction details.
 * It should occur after the transaction identification by qr scanner or manual procedure.
 * TODO:
 * - integrate contextual help
 *    https://www.pivotaltracker.com/n/projects/2048617/stories/158108270
 * - check availability of displayed data. Define optional data and implement their rendering as preferred
 */

import {
  Body,
  Button,
  Container,
  Content,
  H1,
  H3,
  Left,
  Right,
  Text,
  View
} from "native-base";
import * as React from "react";
import { Image, StyleSheet } from "react-native";
import { Col, Grid, Row } from "react-native-easy-grid";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { WalletStyles } from "../../../components/styles/wallet";
import AppHeader from "../../../components/ui/AppHeader";
import PaymentSummaryComponent from "../../../components/wallet/PaymentSummaryComponent";
import I18n from "../../../i18n";
import Icon from "../../../theme/font-icons/io-icon-font/index";
import variables from "../../../theme/variables";

import { PaymentData, paymentDataSelector } from '../../../store/reducers/wallet/payment';
import { GlobalState } from '../../../store/reducers/types';
import { connect } from 'react-redux';
import { Option } from 'fp-ts/lib/Option';

type ReduxMappedProps = Readonly<{
  paymentData: Option<PaymentData>
}>;

type OwnProps = Readonly<{
  navigation: NavigationScreenProp<NavigationState>;
}>;

type Props = OwnProps & ReduxMappedProps;

const styles = StyleSheet.create({
  padded: {
    paddingRight: variables.contentPadding,
    paddingLeft: variables.contentPadding
  }
});

class FirstTransactionSummaryScreen extends React.Component<
  Props,
  never
> {
  constructor(props: Props) {
    super(props);
  }

  private goBack() {
    this.props.navigation.goBack();
  }

  public render(): React.ReactNode {
    if (this.props.paymentData.isNone()) {
      return <Text>ERROR</Text>;
    }
    const { transactionInfo, recipient, subject } = this.props.paymentData.value;

    return (
      <Container>
        <AppHeader>
          <Left>
            <Button transparent={true} onPress={() => this.goBack()}>
              <Icon name="io-back" size={variables.iconSize1} />
            </Button>
          </Left>
          <Body>
            <Text>{I18n.t("wallet.firstTransactionSummary.header")}</Text>
          </Body>
        </AppHeader>

        <Content noPadded={true}>
          <Grid style={[styles.padded, WalletStyles.backContent]}>
            <Row>
              <Col size={5}>
                <View spacer={true} large={true} />
                <H3 style={WalletStyles.white}>
                  {I18n.t("wallet.firstTransactionSummary.title")}
                </H3>
                <H1 style={WalletStyles.white}>
                  {transactionInfo.paymentReason}
                </H1>
              </Col>
              <Col size={1}>
                <View spacer={true} large={true} />
                <Image
                  source={require("../../../../img/wallet/icon-avviso-pagopa.png")}
                />
              </Col>
            </Row>
            <View spacer={true} large={true} />
          </Grid>

          <PaymentSummaryComponent
            navigation={this.props.navigation}
            amount={transactionInfo.notifiedAmount.toString()}
            updatedAmount={transactionInfo.currentAmount.toString()}
          />

          <Grid style={[styles.padded, WalletStyles.backContent]}>
            <Row>
              <Left>
                <H3 style={WalletStyles.white}>
                  {I18n.t("wallet.firstTransactionSummary.expireDate")}
                </H3>
              </Left>
              <Right>
                <H1 style={WalletStyles.white}>
                  {transactionInfo.expireDate.toLocaleDateString()}
                </H1>
              </Right>
            </Row>
            <View spacer={true} />
            <Row>
              <Left>
                <H3 style={WalletStyles.white}>
                  {I18n.t("wallet.firstTransactionSummary.tranche")}
                </H3>
              </Left>
              <Right>
                <H1 style={WalletStyles.white}>{transactionInfo.tranche}</H1>
              </Right>
            </Row>
            <View spacer={true} large={true} />
          </Grid>

          <View spacer={true} large={true} />
          <Grid style={styles.padded}>
            <Row>
              <Text bold={true}>
                {I18n.t("wallet.firstTransactionSummary.entity")}
              </Text>
            </Row>
            <Row>
              <Text>{recipient.name}</Text>
            </Row>
            <Row>
              <Text>{recipient.address}</Text>
            </Row>
            <Row>
              <Text>{recipient.city}</Text>
            </Row>
            <Row>
              <Text>{I18n.t("wallet.firstTransactionSummary.info")}</Text>
            </Row>
            <Row>
              <Text>{I18n.t("wallet.firstTransactionSummary.tel") + " "}</Text>
              <Text link={true}>{recipient.tel}</Text>
            </Row>
            <Row>
              <Text link={true}>{recipient.webpage}</Text>
            </Row>
            <Row>
              <Text>
                {I18n.t("wallet.firstTransactionSummary.email") + " "}
              </Text>
              <Text link={true}>{recipient.email}</Text>
            </Row>
            <Row>
              <Text>{I18n.t("wallet.firstTransactionSummary.PEC") + " "}}</Text>
              <Text link={true}>{recipient.pec}</Text>
            </Row>
            <View spacer={true} large={true} />
            <Row>
              <Text bold={true}>
                {I18n.t("wallet.firstTransactionSummary.recipient")}
              </Text>
            </Row>
            <Row>
              <Text>{subject.name}</Text>
            </Row>
            <Row>
              <Text>{subject.address}</Text>
            </Row>
            <View spacer={true} large={true} />
            <Row>
              <Text bold={true}>
                {I18n.t("wallet.firstTransactionSummary.object")}
              </Text>
            </Row>
            <Row>
              <Text>{transactionInfo.paymentReason}</Text>
            </Row>
            <View spacer={true} large={true} />
            <Row>
              <Text bold={true}>
                {I18n.t("wallet.firstTransactionSummary.cbillCode") + " "}
              </Text>
              <Text bold={true}>{transactionInfo.cbill}</Text>
            </Row>
            <Row>
              <Text bold={true}>
                {I18n.t("wallet.firstTransactionSummary.iuv") + " "}
              </Text>
              <Text bold={true}>{transactionInfo.iuv}</Text>
            </Row>
            <Row>
              <Text bold={true}>
                {I18n.t("wallet.firstTransactionSummary.entityCode2") + " "}
              </Text>
              <Text bold={true}>{recipient.code}</Text>
            </Row>
            <View spacer={true} extralarge={true} />
          </Grid>
        </Content>
        <View footer={true}>
          <Button block={true} primary={true}>
            <Text>{I18n.t("wallet.continue")}</Text>
          </Button>
          <Button block={true} light={true} onPress={(): void => this.goBack()}>
            <Text>{I18n.t("wallet.cancel")}</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = (state: GlobalState): ReduxMappedProps => ({
  paymentData: paymentDataSelector(state)
});

export default connect(mapStateToProps)(FirstTransactionSummaryScreen);