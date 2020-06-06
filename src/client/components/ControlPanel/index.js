import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import './index.css';
import globalStates from '../../global-states';
import TextPanel from '../TextPanel';
import FilePanel from '../FilePanel';
import ReceivedPanel from '../ReceivedPanel';
import { displayStyle } from '../../helper';
import { cacheRecipientId, getCachedRecipientId } from '../../caching';

const tabList = [
  {
    key: 'text',
    tab: 'Send Text',
  },
  {
    key: 'file',
    tab: 'Send File',
  },
  {
    key: 'received',
    tab: 'Data Received',
  }
];

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipientId: getCachedRecipientId() || ''
    };

    this.onChangeRecipientId = this.onChangeRecipientId.bind(this);
    this.changeTab = this.changeTab.bind(this);
  }

  onChangeRecipientId(newVal) {
    this.setState({
      recipientId: newVal
    });

    cacheRecipientId(newVal);
  }

  changeTab(tabKey) {
    const { onTabChange } = this.props;
    onTabChange(tabKey);
  }

  componentDidMount() {
    if (window.Android) {
      window.Android.onWebAppMount();
    }
  }

  render() {
    const { recipientId } = this.state;
    const {
      selectedTabKey, onTabChange, receivedData, onDeleteReceivedData
    } = this.props;

    return (
      <div className="control-panel">
        <Card
          tabList={tabList}
          activeTabKey={selectedTabKey}
          className="control-panel-wrapper"
          title={(
            <span>
              <span className="client-id-label">MY ID</span>
              <span className="client-id">{globalStates.clientId}</span>
            </span>
          )}
          onTabChange={onTabChange}
        >
          <div className="tab-content-wrapper">
            <TextPanel
              style={displayStyle(selectedTabKey === 'text')}
              recipientId={recipientId}
              onChangeRecipientId={this.onChangeRecipientId}
              changeTab={this.changeTab}
            />
            <FilePanel
              style={displayStyle(selectedTabKey === 'file')}
              recipientId={recipientId}
              onChangeRecipientId={this.onChangeRecipientId}
              changeTab={this.changeTab}
            />
            <ReceivedPanel
              style={displayStyle(selectedTabKey === 'received')}
              receivedData={receivedData}
              onDeleteReceivedData={onDeleteReceivedData}
            />
          </div>
        </Card>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  selectedTabKey: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  receivedData: PropTypes.instanceOf(Array).isRequired,
  onDeleteReceivedData: PropTypes.func.isRequired,
};

export default ControlPanel;
