import * as React from 'react';

export type Props = {
  attrs: any;
}

export default class YouTubeEmbed extends React.Component<Props> {
  render() {
    const { attrs } = this.props;
    const videoId = attrs.matches[1];

    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?modestbranding=1`}
      />
    );
  }
}