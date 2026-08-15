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
              <span>Utilisation du Site</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] leading-tight">
              Conditions Générales d'Utilisation (CGU)
            </h1>
            <p className="text-base sm:text-lg text-[#5e4d46] font-medium max-w-2xl">
              Conditions générales d'utilisation du site www.guides-digitaux.com.
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
<h1>Conditions générales d’utilisationdu site guides-digitaux.com</h1>
<h2>Préambule</h2>
<p>Les présentes conditions générales d’utilisation sont conclues entre :<br/>
– le gérant du site internet, ci-après désigné « l’Éditeur »,<br/>
– toute personne souhaitant accéder au site et à ses services, ci-après appelé « l’Utilisateur ».</p>
<h2>
Article 1 – Principes</h2>
<p>Les présentes conditions générales d’utilisation ont pour objet l’encadrement juridique de l’utilisation du site guides<br/>
digitaux et de ses services.<br/>
Le site Internet www.guides-digitaux.com est un service de :<br/>
L’entreprise individuelle guides digitaux<br/>
située 40 rue du Hoccart Comines, France<br/>
adresse URL du site : www.guides-digitaux.com<br/>
e-mail : contact@guides-digitaux.com<br/>
numéro de téléphone : 0782404062<br/>
Les conditions générales d’utilisation doivent être acceptées par tout Utilisateur, et son accès au site vaut acceptation de ces<br/>
conditions.</p>
<h2>
Article 2 – Evolution et durée des CGU</h2>
<p>Les présentes conditions générales d’utilisation sont conclues pour une durée indéterminée. Le contrat produit ses effets à<br/>
l’égard de l’Utilisateur à compter du début de l’utilisation du service.<br/>
Le site guides digitaux se réserve le droit de modifier les clauses de ces conditions générales d’utilisation à tout moment et<br/>
sans justification.</p>
<h2>
Article 3 – Accès au site</h2>
<p>Tout Utilisateur ayant accès à internet peut accéder gratuitement et depuis n’importe où au site guides digitaux. Les frais<br/>
supportés par l’Utilisateur pour y accéder (connexion internet, matériel informatique, etc.) ne sont pas à la charge de<br/>
l’Éditeur.<br/>
Le site et ses différents services peuvent être interrompus ou suspendus par l’Éditeur, notamment à l’occasion d’une<br/>
maintenance, sans obligation de préavis ou de justification.<br/>
L���Utilisateur du site a accès aux services suivants : formations, guides, ebook et checklist numériques.<br/>
Le site comprend un espace membre payant réservé aux utilisateurs inscrits. Ces utilisateurs pourront y accéder en utilisant<br/>
leurs identifiants de connexion.<br/>
Les services réservés aux membres sont les suivants : compte personnel, téléchargement des produits achetés.</p>
<h2>
Article 4 – Responsabilités</h2>
<p>La responsabilité de l’Éditeur ne peut être engagée en cas de défaillance, panne, difficulté ou interruption de fonctionnement,<br/>
empêchant l’accès au site ou à une de ses fonctionnalités.<br/>
Le matériel de connexion au site utilisée est sous l’entière responsabilité de l’Utilisateur qui doit prendre toutes les mesures<br/>
appropriées pour protéger le matériel et les données notamment d’attaques virales par Internet. L’utilisateur est par ailleurs le<br/>
seul responsable des sites et données qu’il consulte.<br/>
L’Éditeur ne pourra être tenu responsable en cas de poursuites judiciaires à l’encontre de l’Utilisateur :<br/>
– du fait de l’usage du site ou de tout service accessible via Internet ;<br/>
– du fait du non-respect par l’Utilisateur des présentes conditions générales.<br/>
L’Éditeur n’est pas responsable des dommages causés à l’Utilisateur, à des tiers et/ou à l’équipement de l’Utilisateur du fait de<br/>
sa connexion ou de son utilisation du site et l’Utilisateur renonce à toute action contre l’Éditeur de ce fait.<br/>
Si l’Éditeur venait à faire l’objet d’une procédure amiable ou judiciaire à raison de l’utilisation du site par l’Utilisateur, il<br/>
pourra retourner contre lui pour obtenir indemnisation de tous les préjudices, sommes, condamnations et frais qui pourraient<br/>
découler de cette procédure.</p>
<h2>
Article 5 – Propriété intellectuelle</h2>
<p>Tous les documents techniques, produits, photographies, textes, logos, dessins, vidéos, etc., sont soumis à des droits d’auteur<br/>
et sont protégés par le Code de la propriété intellectuelle. Lorsqu’ils sont remis à nos clients, ils demeurent la propriété<br/>
exclusive de guides digitaux, seul titulaire des droits de propriété intellectuelle sur ces documents, qui doivent lui être rendus<br/>
à sa demande.<br/>
Nos clients s’engagent à ne faire aucun usage de ces documents, susceptible de porter atteinte aux droits de propriété<br/>
industrielle ou intellectuelle du fournisseur et s’engagent à ne les divulguer à aucun tiers, en dehors d’une autorisation<br/>
expresse et préalable donnée par l’Editeur.</p>
<h2>
Article 6 – Liens hypertextes</h2>
<p>La mise en place par l’Utilisateur de tous liens hypertextes vers tout ou partie du site est strictement interdite, sauf autorisation<br/>
préalable et écrite de l’Éditeur, sollicitée par courriel à l’adresse suivante : contact@guides-digitaux.com.<br/>
L’Éditeur est libre de refuser cette autorisation sans avoir à justifier de quelque manière que ce soit sa décision. Dans le cas où<br/>
l’Éditeur accorderait son autorisation, celle-ci n’est dans tous les cas que temporaire et pourra être retirée à tout moment, sans<br/>
obligation de justification à la charge de l’Éditeur.<br/>
Dans tous les cas, tout lien devra être retiré sur simple demande de l’Éditeur.<br/>
Toute information accessible via un lien vers d’autres sites n’est pas sous le contrôle de l’Éditeur qui décline toute<br/>
responsabilité quant à leur contenu.</p>
<h2>
Article 7 – Protection des données personnelles</h2>
<h3>
Données collectées</h3>
<p>Les données à caractère personnel qui sont collectées sur ce site sont les suivantes :<br/>
– ouverture de compte : lors de la création du compte de l’utilisateur : nom ; prénom ; adresse électronique ; n° de téléphone<br/>
; adresse postale ;<br/>
– connexion : lors de la connexion de l’utilisateur au site web, celui-ci enregistre, notamment, ses nom, prénom, données de<br/>
connexion, d’utilisation, de localisation et ses données relatives au paiement ;<br/>
– profil : l’utilisation des prestations prévues sur le site web permet de renseigner un profil, pouvant comprendre une adresse<br/>
et un numéro de téléphone ;<br/>
– paiement : dans le cadre du paiement des produits et prestations proposés sur le site web, celui-ci enregistre des données<br/>
financières relatives au compte bancaire ou à la carte de crédit de l’utilisateur ;<br/>
– communication : lorsque le site web est utilisé pour communiquer avec d’autres membres, les données concernant les<br/>
communications de l’utilisateur font l’objet d’une conservation temporaire ;<br/>
– cookies : les cookies sont utilisés, dans le cadre de l’utilisation du site. L’utilisateur a la possibilité de désactiver les cookies<br/>
à partir des paramètres de son navigateur.</p>
<h3>
Utilisation des données personnelles</h3>
<p>Les données personnelles collectées auprès des utilisateurs ont pour objectif la mise à disposition des services du site web,<br/>
leur amélioration et le maintien d’un environnement sécurisé. Plus précisément, les utilisations sont les suivantes :<br/>
– accès et utilisation du site web par l’utilisateur ;<br/>
– gestion du fonctionnement et optimisation du site web ;<br/>
– organisation des conditions d’utilisation des Services de paiement ;<br/>
– vérification, identification et authentification des données transmises par l’utilisateur ;<br/>
– proposition à l’utilisateur de la possibilité de communiquer avec d’autres utilisateurs du site web ;<br/>
– mise en oeuvre d’une assistance utilisateurs ;<br/>
– personnalisation des services en affichant des publicités en fonction de l’historique de navigation de l’utilisateur, selon ses<br/>
préférences ;<br/>
– prévention et détection des fraudes, malwares (malicious softwares ou logiciels malveillants) et gestion des incidents de<br/>
sécurité ;<br/>
– gestion des éventuels litiges avec les utilisateurs ;<br/>
– envoi d’informations commerciales et publicitaires, en fonction des préférences de l’utilisateur.</p>
<h3>
Partage des données personnelles avec des tiers</h3>
<p>Les données personnelles peuvent être partagées avec des sociétés tierces, dans les cas suivants :<br/>
– lorsque l’Utilisateur utilise les services de paiement, pour la mise en oeuvre de ces services, le site web est en relation avec<br/>
des sociétés bancaires et financières tierces avec lesquelles elle a passé des contrats ;<br/>
– lorsque l’Utilisateur publie, dans les zones de commentaires libres du site web, des informations accessibles au public ;<br/>
– lorsque l’Utilisateur autorise le site web d’un tiers à accéder à ses données ;<br/>
– lorsque le site web recourt aux services de prestataires pour fournir l’assistance utilisateurs, la publicité et les services de<br/>
paiement. Ces prestataires disposent d’un accès limité aux données de l’utilisateur, dans le cadre de l’exécution de ces</p>
<p>prestations, et ont une obligation contractuelle de les utiliser en conformité avec les dispositions de la réglementation<br/>
applicable en matière protection des données à caractère personnel ;<br/>
– si la loi l’exige, le site web peut effectuer la transmission de données pour donner suite aux réclamations présentées contre<br/>
le site web et se conformer aux procédures administratives et judiciaires ;<br/>
– si le site web est impliquée dans une opération de fusion, acquisition, cession d’actifs ou procédure de redressement<br/>
judiciaire, elle pourra être amenée à céder ou partager tout ou partie de ses actifs, y compris les données à caractère personnel.<br/>
Dans ce cas, les utilisateurs seraient informés, avant que les données à caractère personnel ne soient transférées à une tierce<br/>
partie.</p>
<h3>
Sécurité et confidentialité</h3>
<p>Le site web met en oeuvre des mesures organisationnelles, techniques, logicielles et physiques en matière de sécurité du<br/>
numérique pour protéger les données personnelles contre les altérations, destructions et accès non autorisés. Toutefois, il est à<br/>
signaler qu’internet n’est pas un environnement complètement sécurisé et le site web ne peut pas garantir la sécurité de la<br/>
transmission ou du stockage des informations sur internet.</p>
<h3>
Mise en oeuvre des droits des utilisateurs</h3>
<p>En application de la réglementation applicable aux données à caractère personnel, les utilisateurs disposent des droits<br/>
suivants, qu’ils peuvent exercer en faisant leur demande à l’adresse suivante : contact@guides-digitaux.com.<br/>
le droit d’accès : ils peuvent exercer leur droit d’accès, pour connaître les données personnelles les concernant. Dans ce<br/>
cas, avant la mise en œuvre de ce droit, le site web peut demander une preuve de l’identité de l’utilisateur afin d’en<br/>
vérifier l’exactitude.<br/>
le droit de rectification : si les données à caractère personnel détenues par le site web sont inexactes, ils peuvent<br/>
demander la mise à jour des informations.<br/>
le droit de suppression des données : les utilisateurs peuvent demander la suppression de leurs données à caractère<br/>
personnel, conformément aux lois applicables en matière de protection des données.<br/>
le droit à la limitation du traitement : les utilisateurs peuvent de demander au site web de limiter le traitement des<br/>
données personnelles conformément aux hypothèses prévues par le RGPD.<br/>
le droit de s’opposer au traitement des données : les utilisateurs peuvent s’opposer à ce que ses données soient traitées<br/>
conformément aux hypothèses prévues par le RGPD.<br/>
le droit à la portabilité : ils peuvent réclamer que le site web leur remette les données personnelles qui lui sont fournies<br/>
pour les transmettre à un nouveau site web.</p>
<h3>
Evolution de la présente clause</h3>
<p>Le site web se réserve le droit d’apporter toute modification à la présente clause relative à la protection des données à<br/>
caractère personnel à tout moment. Si une modification est apportée à la présente clause de protection des données à caractère<br/>
personnel, le site web s’engage à publier la nouvelle version sur son site. Le site web informera également les utilisateurs de<br/>
la modification par messagerie électronique, dans un délai minimum de 15 jours avant la date d’effet. Si l’utilisateur n’est pas<br/>
d’accord avec les termes de la nouvelle rédaction de la clause de protection des données à caractère personnel, il a la<br/>
possibilité de supprimer son compte.</p>
<h2>
Article 8 – Cookies</h2>
<p>Le site guides digitaux peut collecter automatiquement des informations standards. Toutes les informations collectées<br/>
indirectement ne seront utilisées que pour suivre le volume, le type et la configuration du trafic utilisant ce site, pour en<br/>
développer la conception et l’agencement et à d’autres fins administratives et de planification et plus généralement pour<br/>
améliorer le service que nous vous offrons.</p>
<h2>
Article 9 – Loi applicable</h2>
<p>Les présentes conditions générales d’utilisation sont soumises à l’application du droit français.<br/>
Si les parties n’arrivent pas à résoudre un litige à l’amiable, le litige sera soumis à la compétence des tribunaux français.</p>
<p> </p>
<p>Ces CGU Conditions générales d’utilisation ont été créées sur le site Rocket Lawyer.</p>
</div>	</div>
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
