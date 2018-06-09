import * as React from 'react';
import { ChildProps, graphql } from 'react-apollo'
import gql from 'graphql-tag';

const historyQuery = gql`
  query SampleQuery($solutionId: String!) {
    history(solutionId: $solutionId) {
      solutionId
    }
  }
`;

interface Data {
  history: {
    solutionId: string;
  }
}

interface Props {
  solutionId: string;
}

class HistoryView extends React.Component<ChildProps<Props, Data>> {
  render() {
    const { data } = this.props;

    if (data.loading) {
      return (
        <div>Loading</div>
      )
    }

    return (
      <div>{data.history.solutionId}</div>
    )
  }
}


const withData = graphql<Props, Data>(historyQuery, {
  options: ({ solutionId }) => ({ variables: { solutionId } })
});

export const HistoryViewWithData = withData(HistoryView);
