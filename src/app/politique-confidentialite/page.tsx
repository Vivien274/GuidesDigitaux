'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Scale, ArrowLeft } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Header />

      {/* HERO */}
      <section className="bg-gradient-to-b from-[#f4ede0]/70 to-[#faf8f5] py-12 sm:py-16 border-b border-[#e8ded0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-black text-[#18757d] hover:text-[#12595f] uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </Link>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#18757d] text-white text-xs font-black rounded-full uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Protection des Données</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] leading-tight">
              Politique de Confidentialité
            </h1>
            <p className="text-base sm:text-lg text-[#5e4d46] font-medium max-w-2xl">
              Politique de protection des données personnelles et d'exercice des droits RGPD.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN LEGAL CONTENT */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e8ded0] shadow-sm text-[#332420] prose max-w-none prose-headings:text-[#18757d] prose-headings:font-black prose-p:text-[#4a3b35] prose-p:font-medium prose-p:leading-relaxed prose-li:text-[#4a3b35] prose-li:font-medium prose-a:text-[#18757d] prose-a:font-bold hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: `
<div class="tg-page-area section-py-120">
<div class=container>
<div class=row>
<div class=col-xl-12>
<div class="tg-page-content eduvalt-page-content">
<div class=tp-page-post>
<h1 class=wp-block-heading>Mentions légales et politique de confidentialité</h1>
<p>L’entreprise individuelle Stephanie ROCQ, soucieuse des droits des individus, notamment au regard des<br/>traitements automatisés et dans une volonté de transparence avec ses clients, a mis en place une politique<br/>reprenant l’ensemble de ces traitements, des finalités poursuivies par ces derniers ainsi que des moyens<br/>d’actions à la disposition des individus afin qu’ils puissent au mieux exercer leurs droits.<br/>Pour toute information complémentaire sur la protection des données personnelles, nous vous invitons à<br/>consulter le site : https://www.cnil.fr/<br/>La poursuite de la navigation sur ce site vaut acceptation sans réserve des dispositions et conditions<br/>d’utilisation qui suivent.<br/>La version actuellement en ligne de ces conditions d’utilisation est la seule opposable pendant toute la durée<br/>d’utilisation du site et jusqu’à ce qu’une nouvelle version la remplace.</p>
<h2><br/>Article 1 – Mentions légales</h2>
<h2>1.1 Site (ci-après « le site ») :</h2>
<p><br/>Guides digitaux</p>
<h3><br/>1.2 Éditeur (ci-après « l’éditeur ») :</h3>
<p><br/>L’entreprise individuelle Stephanie ROCQ<br/>située : 40 rue du Hoccart, 59560 Comines<br/>immatriculée au RCS de Lille 82119498700038<br/>n° de téléphone : 0782404062<br/>adresse mail : contact@guides-digitaux.com</p>
<h3><br/>1.3 Hébergeur (ci-après « l’hébergeur ») :</h3>
<p>Guides digitaux est hébergé par O2switch, dont le siège social est situé chemin des pardiaux 63000 Clermont-<br/>Ferrand.</p>
<h2>Article 2 – Accès au site</h2>
<p><br/>L’accès au site et son utilisation sont réservés à un usage strictement personnel. Vous vous engagez à ne pas<br/>utiliser ce site et les informations ou données qui y figurent à des fins commerciales, politiques, publicitaires<br/>et pour toute forme de sollicitation commerciale et notamment l’envoi de courriers électroniques non<br/>sollicités.</p>
<h2><br/>Article 3 – Contenu du site</h2>
<p><br/>Toutes les marques, photographies, textes, commentaires, illustrations, images animées ou non, séquences<br/>vidéo, sons, ainsi que toutes les applications informatiques qui pourraient ��tre utilisées pour faire fonctionner<br/>ce site et plus généralement tous les éléments reproduits ou utilisés sur le site sont protégés par les lois en<br/>vigueur au titre de la propriété intellectuelle.<br/>Ils sont la propriété pleine et entière de l’éditeur ou de ses partenaires. Toute reproduction, représentation,<br/>utilisation ou adaptation, sous quelque forme que ce soit, de tout ou partie de ces éléments, y compris les<br/>applications informatiques, sans l’accord préalable et écrit de l’éditeur, sont strictement interdites. Le fait pour<br/>l’éditeur de ne pas engager de procédure dès la prise de connaissance de ces utilisations non autorisées ne vaut<br/>pas acceptation desdites utilisations et renonciation aux poursuites.</p>
<h2><br/>Article 4 – Gestion du site</h2>
<p><br/>Pour la bonne gestion du site, l’éditeur pourra à tout moment :<br/>– suspendre, interrompre ou limiter l’accès à tout ou partie du site, réserver l’accès au site, ou à certaines<br/>parties du site, à une catégorie déterminée d’internautes ;<br/>– supprimer toute information pouvant en perturber le fonctionnement ou entrant en contravention avec les<br/>lois nationales ou internationales ;<br/>– suspendre le site afin de procéder à des mises à jour.</p>
<h2><br/>Article 5 – Responsabilités</h2>
<p>La responsabilité de l’éditeur ne peut être engagée en cas de défaillance, panne, difficulté ou interruption de<br/>fonctionnement, empêchant l’accès au site ou à une de ses fonctionnalités.<br/>Le matériel de connexion au site que vous utilisez est sous votre entière responsabilité. Vous devez prendre<br/>toutes les mesures appropriées pour protéger votre matériel et vos propres données notamment d’attaques<br/>virales par Internet. Vous êtes par ailleurs seul responsable des sites et données que vous consultez.<br/>L’éditeur ne pourra être tenu responsable en cas de poursuites judiciaires à votre encontre :<br/>– du fait de l’usage du site ou de tout service accessible via Internet ;<br/>– du fait du non-respect par vous des présentes conditions générales.<br/>L’éditeur n’est pas responsable des dommages causés à vous-même, à des tiers et/ou à votre équipement du<br/>fait de votre connexion ou de votre utilisation du site et vous renoncez à toute action contre lui de ce fait.<br/>Si l’éditeur venait à faire l’objet d’une procédure amiable ou judiciaire en raison de votre utilisation du site, il<br/>pourra se retourner contre vous pour obtenir l’indemnisation de tous les préjudices, sommes, condamnations et<br/>frais qui pourraient découler de cette procédure.</p>
<h2><br/>Article 6 – Liens hypertextes</h2>
<p><br/>La mise en place par les utilisateurs de tous liens hypertextes vers tout ou partie du site est autorisée par<br/>l’éditeur. Tout lien devra être retiré sur simple demande de l’éditeur.<br/>Toute information accessible via un lien vers d’autres sites n’est pas publiée par l’éditeur. L’éditeur ne dispose<br/>d’aucun droit sur le contenu présent dans ledit lien.</p>
<h2>Article 7 – Collecte et protection des données</h2>
<p><br/>Vos données sont collectées par l’entreprise individuelle Stephanie ROCQ.<br/>Une donnée à caractère personnel désigne toute information concernant une personne physique identifiée ou<br/>identifiable (personne concernée) ; est réputée identifiable une personne qui peut être identifiée, directement<br/>ou indirectement, notamment par référence à un nom, un numéro d’identification ou à un ou plusieurs<br/>éléments spécifiques, propres à son identité physique, physiologique, génétique, psychique, économique,<br/>culturelle ou sociale.<br/>Les informations personnelles pouvant être recueillies sur le site sont principalement utilisées par l’éditeur<br/>pour la gestion des relations avec vous, et le cas échéant pour le traitement de vos commandes.<br/>Les données personnelles collectées sont les suivantes :<br/>– nom et prénom<br/>– adresse<br/>– adresse mail<br/>– numéro de téléphone<br/>– date de naissance</p>
<p>– données financières : dans le cadre du paiement des produits et prestations proposés sur la Plateforme, celle-<br/>ci enregistre des données financières relatives à la carte de crédit de l’utilisateur.</p>
<h2>Article 8 – Droit d’accès, de rectification et de déréférencement de vos données</h2>
<p><br/>En application de la réglementation applicable aux données à caractère personnel, les utilisateurs disposent<br/>des droits suivants :<br/>le droit d’accès : ils peuvent exercer leur droit d’accès, pour connaître les données personnelles les<br/>concernant, en écrivant à l’adresse électronique ci-dessous mentionnée. Dans ce cas, avant la mise en<br/>œuvre de ce droit, la Plateforme peut demander une preuve de l’identité de l’utilisateur afin d’en vérifier<br/>l’exactitude ;<br/>le droit de rectification : si les données à caractère personnel détenues par la Plateforme sont inexactes,<br/>ils peuvent demander la mise à jour des informations ;<br/>le droit de suppression des données : les utilisateurs peuvent demander la suppression de leurs données<br/>à caractère personnel, conformément aux lois applicables en matière de protection des données ;<br/>le droit à la limitation du traitement : les utilisateurs peuvent de demander à la Plateforme de limiter le<br/>traitement des données personnelles conformément aux hypothèses prévues par le RGPD ;<br/>le droit de s’opposer au traitement des données : les utilisateurs peuvent s’opposer à ce que<br/>leurs données soient traitées conformément aux hypothèses prévues par le RGPD ;<br/>le droit à la portabilité : ils peuvent réclamer que la Plateforme leur remette les données personnelles<br/>qu’ils ont fournies pour les transmettre à une nouvelle Plateforme.</p>
<p>Vous pouvez exercer ce droit en nous contactant, à l’adresse suivante :<br/>40 rue du Hoccart 59560 Comines.<br/>Ou par email, à l’adresse :<br/>contact@guides-digitaux.com</p>
<p><br/>Toute demande doit être accompagnée de la photocopie d’un titre d’identité en cours de validité signé et faire<br/>mention de l’adresse à laquelle l’éditeur pourra contacter le demandeur. La réponse sera adressée dans le mois<br/>suivant la réception de la demande. Ce délai d’un mois peut être prolongé de deux mois si la complexité de la<br/>demande et/ou le nombre de demandes l’exigent.</p>
<p><br/>De plus, et depuis la loi n°2016-1321 du 7 octobre 2016, les personnes qui le souhaitent, ont la possibilité<br/>d’organiser le sort de leurs données après leur décès. Pour plus d’information sur le sujet, vous pouvez<br/>consulter le site Internet de la CNIL : https://www.cnil.fr/.<br/>Les utilisateurs peuvent aussi introduire une réclamation auprès de la CNIL sur le site de la<br/>CNIL : https://www.cnil.fr.</p>
<p><br/>Nous vous recommandons de nous contacter dans un premier temps avant de déposer une réclamation auprès<br/>de la CNIL, car nous sommes à votre entière disposition pour régler votre problème.</p>
<h2><br/>Article 9 – Utilisation des données</h2>
<p><br/>Les données personnelles collectées auprès des utilisateurs ont pour objectif la mise à disposition des services<br/>de la Plateforme, leur amélioration et le maintien d’un environnement sécurisé. La base légale des traitements<br/>est l’exécution du contrat entre l’utilisateur et la Plateforme. Plus précisément, les utilisations sont les<br/>suivantes :<br/>– accès et utilisation de la Plateforme par l’utilisateur ;<br/>– gestion du fonctionnement et optimisation de la Plateforme ;<br/>– mise en œuvre d’une assistance utilisateurs ;<br/>– vérification, identification et authentification des données transmises par l’utilisateur ;<br/>– personnalisation des services en affichant des publicités en fonction de l’historique de navigation de<br/>l’utilisateur, selon ses préférences ;<br/>– prévention et détection des fraudes, malwares (malicious softwares ou logiciels malveillants) et gestion des<br/>incidents de sécurité ;<br/>– gestion des éventuels litiges avec les utilisateurs ;<br/>– envoi d’informations commerciales et publicitaires, en fonction des préférences de l’utilisateur ;<br/>– organisation des conditions d’utilisation des Services de paiement.</p>
<h2><br/>Article 10 – Politique de conservation des données</h2>
<p><br/>La Plateforme conserve vos données pour la durée nécessaire pour vous fournir ses services ou<br/>son assistance.<br/>Dans la mesure raisonnablement nécessaire ou requise pour satisfaire aux obligations légales ou<br/>réglementaires, régler des litiges, empêcher les fraudes et abus ou appliquer nos modalités et conditions, nous<br/>pouvons également conserver certaines de vos informations si nécessaire, même après que vous ayez fermé<br/>votre compte ou que nous n’ayons plus besoin pour vous fournir nos services.</p>
<h2><br/>Article 11- Partage des données personnelles avec des tiers</h2>
<p><br/>Les données personnelles peuvent être partagées avec des sociétés tierces exclusivement dans l’Union<br/>européenne, dans les cas suivants :<br/>– quand l’utilisateur utilise les services de paiement, pour la mise en œuvre de ces services, la Plateforme est<br/>en relation avec des sociétés bancaires et financières tierces avec lesquelles elle a passé des contrats ;<br/>– lorsque l’utilisateur publie, dans les zones de commentaires libres de la Plateforme, des informations<br/>accessibles au public ;<br/>– quand l’utilisateur autorise le site web d’un tiers à accéder à ses données ;<br/>– quand la Plateforme recourt aux services de prestataires pour fournir l’assistance utilisateurs, la publicité et<br/>les services de paiement. Ces prestataires disposent d’un accès limité aux données de l’utilisateur, dans le<br/>cadre de l’exécution de ces prestations, et ont l’obligation contractuelle de les utiliser en conformité avec les<br/>dispositions de la réglementation applicable en matière protection des données à caractère personnel ;</p>
<p>– si la loi l’exige, la Plateforme peut effectuer la transmission de données pour donner suite aux réclamations<br/>présentées contre la Plateforme et se conformer aux procédures administratives et judiciaires.</p>
<h2><br/>Article 12 – Offres commerciales</h2>
<p><br/>Vous êtes susceptible de recevoir des offres commerciales de l’éditeur. Si vous ne le souhaitez pas, veuillez<br/>cliquer sur le lien suivant : contact@guides-digitaux.com.<br/>Vos données sont susceptibles d’être utilisées par les partenaires de l’éditeur à des fins de prospection<br/>commerciale, si vous ne le souhaitez pas, veuillez cliquer sur le lien suivant : contact@guides-digitaux.com.<br/>Si, lors de la consultation du site, vous accédez à des données à caractère personnel, vous devez vous abstenir<br/>de toute collecte, de toute utilisation non autorisée et de tout acte pouvant constituer une atteinte à la vie<br/>privée ou à la réputation des personnes. L’éditeur décline toute responsabilité à cet égard.<br/>Les données sont conservées et utilisées pour une durée conforme à la législation en vigueur.</p>
<h2><br/>Article 13 – Cookies</h2>
<p><br/>Qu’est-ce qu’un « cookie » ?<br/>Un « Cookie » ou traceur est un fichier électronique déposé sur un terminal (ordinateur, tablette,<br/>smartphone,…) et lu par exemple lors de la consultation d’un site internet, de la lecture d’un courrier<br/>électronique, de l’installation ou de l’utilisation d’un logiciel ou d’une application mobile et ce, quel que soit le<br/>type de terminal utilisé (source : https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi).<br/>Le site peut collecter automatiquement des informations standards. Toutes les informations collectées indirectement ne seront<br/>utilisées que pour suivre le volume, le type et la configuration du trafic utilisant ce site, pour en développer la conception et<br/>l’agencement et à d’autres fins administratives et de planification et plus généralement pour améliorer le service que nous<br/>vous offrons.</p>
<p><br/>Le cas échéant, des « cookies » émanant de l’éditeur du site et/ou des sociétés tiers pourront être déposés sur<br/>votre terminal, avec votre accord. Dans ce cas, lors de la première navigation sur ce site, une bannière<br/>explicative sur l’utilisation des « cookies » apparaîtra. Avant de poursuivre la navigation, le client et/ou le<br/>prospect devra accepter ou refuser l’utilisation desdits « cookies ». Le consentement donné sera valable pour<br/>une période de treize (13) mois. L’utilisateur a la possibilité de désactiver les cookies à tout moment.</p>
<p><br/>Les cookies suivants sont présents sur ce site :<br/>Cookies Google :<br/>– Google analytics : permet de mesurer l’audience du site ;<br/>– Google tag manager : facilite l’implémentation des tags sur les pages et permet de gérer les balises Google ;<br/>– Google Adsense : régie publicitaire de Google utilisant les sites web ou les vidéos YouTube comme support<br/>pour ses annonces ;<br/>– Google Dynamic Remarketing : permet de vous proposer de la publicité dynamique en fonction des<br/>précédentes recherches ;<br/>– Google Adwords Conversion : outil de suivi des campagnes publicitaires adwords ;<br/>– DoubleClick : cookies publicitaires de Google pour diffuser des bannières.<br/>Cookies Facebook :<br/>– Facebook connect : permet de s’identifier à l’aide de son compte Facebook ;<br/>– Facebook social plugins : permet de liker, partager, commenter du contenu avec un compte Facebook ;<br/>– Facebook Custom Audience : permet d’intérargir avec l’audience sur Facebook.<br/>La durée de vie de ces cookies est de treize mois.</p>
<h2><br/>Article 14 – Photographies et représentation des produits</h2>
<p><br/>Les photographies de produits, accompagnant leur description, ne sont pas contractuelles et n’engagent pas<br/>l’éditeur.</p>
<h2><br/>Article 15 – Loi applicable</h2>
<p><br/>Les présentes conditions d’utilisation du site sont régies par la loi française et soumises à la compétence des<br/>tribunaux du siège social de l’éditeur, sous réserve d’une attribution de compétence spécifique découlant d’un<br/>texte de loi ou réglementaire particulier.</p>
<h2><br/>Article 16 – Contactez-nous</h2>
<p>Pour toute question, information sur les produits présentés sur le site, ou concernant le site lui-même, vous<br/>pouvez laisser un message à l’adresse suivante : contact@guides-digitaux.com.</p>
<p><br/>Ces mentions légales et politique de confidentialité ont été créées sur le site Rocket Lawyer.</p></div>	</div>
</div>
</div>
</div>
</div>
` }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
}
