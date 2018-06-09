import * as React from 'react'
import * as fetchMock from 'fetch-mock';
import * as createApolloProxy from 'react-cosmos-apollo-proxy';
import * as until from 'async-until';

import { mount } from 'enzyme'
import { HistoryViewWithData } from './WrappedComponent'

const historyComponentFixture = {
  component: HistoryViewWithData,
  props: {
    solutionId: 1
  }
};

const LastProxy = ({ fixture }) => <fixture.component {...fixture.props} />;

let onFixtureUpdate;
let wrapper;

const getWrappedComponent = () => {
  wrapper.update();

  return wrapper.find(historyComponentFixture.component.WrappedComponent);
};

const setupTestWrapper = ({ proxyConfig, fixture } = {}) => {
  const ApolloProxy = createApolloProxy(proxyConfig);

  onFixtureUpdate = jest.fn();

  wrapper = mount(
    <ApolloProxy
      nextProxy={{
        value: LastProxy,
        next: () => { }
      }}
      fixture={fixture || historyComponentFixture}
      onComponentRef={() => {}}
      onFixtureUpdate={onFixtureUpdate}
    />
  );
};

describe('<HistoryViewWithData />', () => {
  const resolveWith = {
    history: {
      __typename: 'historyType',
      solutionId: 'Data returned'
    }
  };

  beforeAll(() => {
    fetchMock.post('https://fake', { data: resolveWith });
  });

  afterEach(() => {
    fetchMock.reset();
  });

  it('is solved', async () => {
    setupTestWrapper({
      proxyConfig: {
        endpoint: 'https://fake'
      },
      fixture: {
        ...historyComponentFixture,
        apollo: {
          resolveWith
        }
      }
    });

    expect(getWrappedComponent().text()).toEqual('Loading')

    await until(() => getWrappedComponent().props().data.loading === false);

    expect(getWrappedComponent().text()).toEqual('Data returned')
  });
});
