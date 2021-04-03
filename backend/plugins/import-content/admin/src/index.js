import React from 'react';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import lifecycles from './lifecycles';
import trads from './translations';

export default strapi => {
const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;

function Comp(props) {
  return <App {...props} />;
}

const plugin = {
  blockerComponent: null,
  blockerComponentProps: {},
  description: pluginDescription,
  icon: pluginPkg.strapi.icon,
  id: pluginId,
  initializer: Initializer,
  injectedComponents: [],
  isReady: false,
  layout: null,
  lifecycles,
  leftMenuLinks: [],
  leftMenuSections: [],
  mainComponent: Comp,
  name: pluginPkg.strapi.name,
  preventComponentRendering: false,
  trads,
  menu: {
    // Set a link into the PLUGINS section
    pluginsSectionLinks: [
      {
        destination: `/plugins/${pluginId}`, // Endpoint of the link
        icon: pluginPkg.strapi.icon,
        label: {
          id: `${pluginId}.plugin.name`, // Refers to a i18n
          defaultMessage: pluginPkg.strapi.name,
        },
        name,
        // If the plugin has some permissions on whether or not it should be accessible
        // depending on the logged in user's role you can set them here.
        // Each permission object performs an OR comparison so if one matches the user's ones
        // the link will be displayed
        permissions: [{ action: 'plugins::content-type-builder.read', subject: null }],
      },
    ],
  },
};

return strapi.registerPlugin(plugin);
}