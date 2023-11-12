export type TranslationId =
  | 'Admin.SignatureLoader.title'
  | 'Admin.Stats.Refresh.action.title'
  | 'Admin.Stats.title'
  | 'auth.sign.cta'
  | 'auth.sign.description'
  | 'Badges.Heading.title'
  | 'citizenship.banner.action.title'
  | 'citizenship.banner.pre.subtitle'
  | 'citizenship.banner.pre.title'
  | 'citizenship.banner.subtitle'
  | 'citizenship.banner.title'
  | 'citizenship.checkout.cart.total.label'
  | 'citizenship.checkout.confirmed.details.amount.label'
  | 'citizenship.checkout.confirmed.details.date.label'
  | 'citizenship.checkout.confirmed.details.fee.label'
  | 'citizenship.checkout.confirmed.details.label'
  | 'citizenship.checkout.confirmed.details.state.completed'
  | 'citizenship.checkout.confirmed.details.state.label'
  | 'citizenship.checkout.confirmed.reference.label'
  | 'citizenship.checkout.confirmed.subtitle'
  | 'citizenship.checkout.confirmed.title'
  | 'citizenship.checkout.error.title'
  | 'citizenship.checkout.payDirectly.action.title'
  | 'citizenship.checkout.subtitle'
  | 'citizenship.checkout.title'
  | 'citizenship.factionSelector.title'
  | 'citizenship.intro.description'
  | 'citizenship.intro.title'
  | 'Dashboard.Profile.Placeholder.title'
  | 'dashboard.profile.missingPlayer.label'
  | 'dashboard.profile.missingPlayer.cta'
  | 'discord.link.description'
  | 'Fleet.Heading.title'
  | 'generic.error.denied'
  | 'generic.form.error.number'
  | 'generic.form.error.publicKey.different'
  | 'generic.form.error.publicKey'
  | 'generic.form.error.required'
  | 'generic.next'
  | 'generic.or'
  | 'generic.price'
  | 'generic.solscan.check'
  | 'Home.EnlistBanner.action.title'
  | 'Home.EnlistBanner.description.0'
  | 'Home.EnlistBanner.description.1'
  | 'Home.EnlistBanner.title'
  | 'Home.WelcomeBanner.action.title'
  | 'Home.WelcomeBanner.description.0'
  | 'Home.WelcomeBanner.description.1'
  | 'Home.WelcomeBanner.title'
  | 'Layout.Footer.Disclaimer.text'
  | 'Layout.Footer.PrivacyPolicy.action.title'
  | 'Layout.Footer.TermsAndCondition.action.title'
  | 'Layout.Header.Dashboard.action.title'
  | 'Layout.Loader.title'
  | 'Layout.Sidebar.Dashboard.title'
  | 'Layout.Sidebar.Feedback.title'
  | 'Layout.Sidebar.FleetSim.title'
  | 'Layout.Sidebar.Resources.title'
  | 'Layout.Sidebar.ScoreTool.title'
  | 'Layout.Sidebar.Ships.title'
  | 'Layout.Sidebar.ShipsDeals.title'
  | 'Layout.Sidebar.Stats.title'
  | 'Layout.Treasury.title'
  | 'Layout.Wallet.Connect.title'
  | 'Layout.Wallet.Disconnect.title'
  | 'layout.wallet.modal.connected.effectsLabel'
  | 'Layout.Wallet.Modal.Connected.title'
  | 'Layout.Wallet.Modal.ConnectedTo.title'
  | 'Mint.AccessDenied.text'
  | 'Mint.CheckBadge.text'
  | 'Mint.Hyperspace.text'
  | 'Referral.Banner.description'
  | 'Referral.Banner.title'
  | 'Ships.Details.calico_compakt_hero.description'
  | 'Ships.Details.calico_evac.description'
  | 'Ships.Details.Components.title'
  | 'Ships.Details.Crew.title'
  | 'Ships.Details.fimbul_byos_packlite.description'
  | 'Ships.Details.Modules.title'
  | 'Ships.Details.opal_jet.description'
  | 'Ships.Details.opal_jetjet.description'
  | 'Ships.Details.pearce_f4.description'
  | 'Ships.Details.pearce_x4.description'
  | 'Ships.Details.pearce_x5.description'
  | 'Ships.Details.rainbow_chi.description'
  | 'Ships.Details.rainbow_om.description'
  | 'Ships.Details.saleDate'
  | 'Ships.Details.tufa_feist.description'
  | 'Ships.Details.vzus_ambwe.description'
  | 'Ships.Details.vzus_opod.description'
  | 'Ships.Heading.title'
  | 'Ships.List.Card.BuyAction.title'
  | 'Ships.List.Card.ReadMore.title'
  | 'Ships.Table.Buy.action.title'
  | 'Ships.Table.Column.atlasPrice'
  | 'Ships.Table.Column.atlasPriceVsVwapPrice'
  | 'Ships.Table.Column.name'
  | 'Ships.Table.Column.price'
  | 'Ships.Table.Column.priceVsVwapPrice'
  | 'Ships.Table.Column.vwap'
  | 'Ships.Table.Sell.action.title'
  | 'Ships.Toolbar.grid'
  | 'Ships.Toolbar.table'
  | 'swap.checkout.confirmed.back.action.title'
  | 'swap.checkout.confirmed.description'
  | 'swap.checkout.error.description.notEnoughFunds'
  | 'swap.checkout.error.description'
  | 'swap.checkout.qrcode.hint.0'
  | 'swap.checkout.qrcode.hint.1'
  | 'swap.checkout.transaction.error'
  | 'swap.checkout.transaction.pending'
  | 'swap.checkout.transaction.success'
  | 'swap.intro.discord'
  | 'swap.intro.hint'
  | 'tutor.badgeSelector.pieces'
  | 'tutor.badgeSelector.title'
  | 'tutor.banner.pre.title'
  | 'tutor.banner.subtitle'
  | 'tutor.banner.title'
  | 'tutor.buyBefore31.12.22'
  | 'tutor.checkout.confirmed.subtitle'
  | 'tutor.checkout.subtitle'
  | 'tutor.checkout.title'
  | 'tutor.citizenship.badge'
  | 'tutor.dao.shares'
  | 'tutor.discount.perc'
  | 'tutor.intro.description.l'
  | 'tutor.intro.description.m'
  | 'tutor.intro.description.s'
  | 'tutor.intro.title'
  | 'Wallet.Disconnect.action.title'
  | 'tutor.shares.description.0'
  | 'tutor.shares.description.1'
  | 'tutor.shares.description.2'
  | 'tutor.shares.description.3'
  | 'tutor.badgeSelector.whatYouReceive'
  | 'fleet.heading.claim.cta'
  | 'toast.multiple.pending.transaction'
  | 'toast.multiple.success.transaction'
  | 'resource.intro.title'
  | 'resource.checkout.title'
  | 'resource.checkout.subtitle'
  | 'resource.checkout.confirmed.subtitle'
  | 'resource.intro.description.arco'
  | 'resource.resourceSelector.pieces'
  | 'resource.resourceSelector.resume';

export type TranslationValues = {
  'citizenship.banner.pre.subtitle': { countdown: string };
  'Layout.Wallet.Modal.ConnectedTo.title': { wallet: string };
  'Mint.Hyperspace.text': { seconds: string };
  'Ships.Details.saleDate': { date: string };
  'tutor.badgeSelector.pieces': { items: string };
  'tutor.citizenship.badge': { quantity: string };
  'tutor.dao.shares': { quantity: string };
  'tutor.discount.perc': { discount: string };
  'resource.resourceSelector.resume': {
    nTokens: string;
    quantity: string;
  };
};

export type TranslationValuesId = keyof TranslationValues;

export type GetTranslationValues<T> = T extends TranslationValuesId
  ? { values: TranslationValues[T] }
  : { values?: never };
