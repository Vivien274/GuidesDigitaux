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
              <span>Vente & Services</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] leading-tight">
              Conditions Générales de Vente (CGV)
            </h1>
            <p className="text-base sm:text-lg text-[#5e4d46] font-medium max-w-2xl">
              Conditions générales de vente de prestations de services et produits numériques entre professionnels sur internet.
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
<h1>Conditions générales de vente de prestations de services entre professionnels sur internet</h1>
<h2></h2>
<h2>Préambule</h2>
<p>Les conditions générales de vente décrites ci-après détaillent les droits et obligations de Guides digitaux et de son client dans<br/>
le cadre de la vente de ses prestations de services.<br/>
Toute prestation accomplie par Guides digitaux implique donc l’adhésion sans réserve de l’acheteur aux présentes conditions<br/>
générales de vente.</p>
<h2>Article 1 – Principes</h2>
<p>Ces conditions générales concernent les prestations de services fournis entre professionnels (prestataire / acheteur).<br/>
Les présentes conditions générales expriment l’intégralité des obligations des parties. Elles constituent le socle unique de la<br/>
relation commerciale entre les parties, et, en ce sens, l’acheteur est réputé les accepter sans réserve.<br/>
Les présentes conditions générales de vente prévalent sur tout autre document, et notamment sur toutes conditions générales<br/>
d’achat. Elles s’appliquent, sans restriction ni réserve, à tous les services rendus par le prestataire auprès des acheteurs de<br/>
même catégorie.</p>
<p>Le prestataire et l’acheteur conviennent que les présentes conditions générales régissent exclusivement leur relation. Le<br/>
prestataire se réserve le droit de modifier ponctuellement ses conditions générales.<br/>
Elles seront applicables dès leur mise en ligne.<br/>
Si une condition de prestation de services venait à faire défaut, elle serait considérée être régie par les usages en vigueur dans<br/>
le secteur de la vente à distance dont les sociétés ont leur siège en France.<br/>
Les présentes conditions générales de vente sont communiquées à tout acheteur qui en fait la demande, afin de lui permettre<br/>
de passer commande.</p>
<p>Le fournisseur se réserve le droit de déroger à certaines clauses des présentes, en fonction des négociations menées avec<br/>
l’acheteur, par l’établissement de conditions de vente particulières.<br/>
Le prestataire peut, en outre, établir des conditions générales de vente catégorielles, dérogatoires aux présentes conditions<br/>
générales de vente, en fonction du type d’acheteur considéré, selon des critères qui resteront objectifs. Les acheteurs<br/>
répondant à ces critères se verront alors appliquer ces conditions générales de vente catégorielles.<br/>
Les présentes conditions générales de vente sont applicables jusqu’au 01 janvier 2027.</p>
<h2>Article 2 – Contenu</h2>
<p>Les présentes conditions générales ont pour objet de définir les droits et obligations des parties dans le cadre de la vente en<br/>
ligne des prestations proposées par le prestataire à l’acheteur. Elles concernent les services suivants : formations, guides et<br/>
ebooks digitaux.<br/>
Les présentes conditions ne concernent que les prestations effectuées en France pour des acheteurs situés sur le territoire<br/>
français. Pour toute prestation effectuée hors de France, ou pour un acheteur situé hors de France, il convient de le signaler<br/>
pour obtenir un devis spécifique.</p>
<h2>Article 3 – La commande</h2>
<p>L’acheteur passe sa commande en ligne, à partir du catalogue en ligne et au moyen du formulaire qui figure sur le site.<br/>
Pour que la commande soit validée, l’acheteur devra accepter, en cliquant à l’endroit indiqué sur le site, les présentes<br/>
conditions générales. Son acceptation entraînera l’envoi d’un mail de confirmation de la part du prestataire, conformément aux<br/>
conditions décrites ci-dessous.</p>
<p>Le paiement se fait par prélèvement bancaire.<br/>
Toute commande vaut acceptation des prix et descriptions des prestations proposes.<br/>
Dans certains cas, notamment défaut de paiement, adresse erronée ou autre problème sur le compte de l’acheteur, le<br/>
prestataire se réserve le droit de bloquer la commande de l’acheteur jusqu’à la résolution du problème.<br/>
En cas d’impossibilité de réalisation de la prestation, l’acheteur en sera informé par courrier électronique.</p>
<p>L’annulation de la commande de cette prestation et son éventuel remboursement seront alors effectués, le reste de la<br/>
commande demeurant ferme et définitif.<br/>
Pour toute question relative au suivi d’une commande, l’acheteur doit appeler le 0782404062, du lundi au vendredi, de 9h à<br/>
18h (coût d’un appel local).</p>
<h2>Article 4 – Signature électronique</h2>
<p>La fourniture en ligne des coordonnées bancaires de l’acheteur et la validation finale de la commande vaudront preuve de<br/>
l’accord de l’acheteur et vaudront :<br/>
– exigibilité des sommes dues au titre du bon de commande ;<br/>
– signature et acception expresse de toutes les opérations effectuées.<br/>
En cas d’utilisation frauduleuse des coordonnées bancaires, l’acheteur est invité, dès le constat de cette utilisation, à contacter<br/>
le 0782404062.</p>
<h2>Article 5 – Confirmation de commande</h2>
<p>Les informations contractuelles feront l’objet d’une confirmation par voie d’e-mail au plus tard au moment du début<br/>
d’exécution des prestations, à l’adresse indiquée par l’acheteur au sein du bon de commande.</p>
<h2>Article 6 – Preuve de la transaction</h2>
<p>Les registres informatisés, conservés dans les systèmes informatiques du prestataire dans des conditions raisonnables de<br/>
sécurité, seront considérés comme les preuves des communications, des commandes et des paiements intervenus entre les<br/>
parties. L’archivage des bons de commande et des factures est effectué sur un support fiable et durable pouvant être produit à<br/>
titre de preuve.</p>
<h2>Article 7 – Informations sur les prestations</h2>
<p>Les prestations régies par les présentes conditions générales sont celles qui figurent sur le site internet du prestataire et qui<br/>
sont indiquées comme réalisées par le prestataire ou sous son contrôle. Elles sont proposées dans la limite des disponibilités<br/>
du prestataire.<br/>
Les prestations sont décrites et présentées avec la plus grande exactitude possible. Toutefois si des erreurs ou omissions ont<br/>
pu se produire quant à cette présentation, la responsabilité du prestataire ne pourrait être engagée.</p>
<h2>Article 8 – Prix</h2>
<h3>Calcul</h3>
<p>Sauf convention contraire, le prix des prestations est établi en fonction du nombre et de l’expérience du personnel requis, du<br/>
niveau de compétence et de responsabilité nécessaire ; les taux horaires sont révisés périodiquement. Seront également<br/>
facturés, s’il y a lieu, les frais de déplacement, de subsistance et d’hébergement engagés pour l’exécution des prestations. La<br/>
TVA au taux en vigueur s’ajoute, le cas échéant, aux honoraires et débours. Les retards ou autres problèmes imprévus, dont le<br/>
prestataire n’a pas la maîtrise et qui échappent à son contrôle, peuvent entraîner des honoraires supplémentaires susceptibles<br/>
de faire l’objet d’une facturation complémentaire. Le prestataire s’engage à informer l’acheteur de ces retards et/ou problèmes<br/>
dès qu’ils surviendront afin de pouvoir en évaluer les conséquences avec lui. Des factures seront émises correspondant aux<br/>
prestations fournies et aux débours engagés par provision et au fur et à mesure de leur réalisation. Sauf convention contraire,<br/>
les factures sont émises chaque mois. Le règlement des factures est exigible : dès réception.<br/>
Pénalités de retard</p>
<p>Conformément à la loi, tout retard de paiement oblige le prestataire à facturer des pénalités de retard. Le taux des pénalités de<br/>
retard est établi sur la base du taux minimum légal ; par ailleurs, le débiteur en retard sera tenu de régler au prestataire une<br/>
indemnité forfaitaire pour frais de recouvrement de 40 Euros ; au surplus, le prestataire sera fondé à suspendre l’exécution des<br/>
prestations jusqu’à règlement complet de la facture impayée sans que cette inexécution puisse être considérée comme lui étant<br/>
imputable.</p>
<h3>Acompte</h3>
<p>Toute commande, telle que définie ci-dessus, donne lieu au versement d’un acompte calculé selon les modalités suivantes</p>
<p>: 30% du prix. Hors cas de force majeure, toute annulation de la commande par l’acheteur au-delà d’un délai de 15j après la<br/>
date de la commande ne pourra donner lieu au remboursement de cet acompte prévisionnel.</p>
<h2>Article 9 – Modalités et délais de paiement</h2>
<h3>Règlement</h3>
<p>Le règlement de la commande se fait par prélèvement sur le compte bancaire de l’acheteur. L’acheteur doit rentrer ses<br/>
coordonnées bancaires à l’endroit prévu et confirmer cette saisie par l’ajout de son RIB informatique en pièce jointe du bon de<br/>
commande. Le prestataire se réserve le droit de suspendre toute gestion de commande et toute livraison en cas de refus<br/>
d’autorisation de paiement de la part des organismes officiellement accrédités ou en cas de non-paiement.<br/>
Le prestataire se réserve notamment le droit de refuser d’effectuer une livraison ou d’honorer une commande émanant d’un<br/>
acheteur qui n’aurait pas réglé totalement ou partiellement une commande précédente ou avec lequel un litige de paiement<br/>
serait en cours d’administration. Le prestataire a mis en place une procédure de vérification des commandes destinée à assurer<br/>
qu’aucune personne n’utilise les coordonnées bancaires d’une autre personne à son insu. Dans le cadre de cette vérification, il<br/>
pourra être demandé à l’acheteur d’adresser, par fax ou par mail, au prestataire une copie d’une pièce d’identité ainsi qu’un<br/>
justificatif de domicile. La commande ne sera alors validée qu’après réception et vérification par le prestataire des pièces<br/>
envoyées.</p>
<h3>Paiement à terme</h3>
<p>Le prix est payable en totalité et en un seul versement, dès réception. Ce délai sera mentionné sur la facture adressée à<br/>
l’acheteur.</p>
<h3></h3>
<h3>Retard de paiement</h3>
<p>Tout retard de paiement entraînera l’exigibilité immédiate de la totalité des sommes dues au prestataire par l’acheteur, sans<br/>
préjudice de toute autre action que le prestataire serait en droit d’intenter, à ce titre, à l’encontre de l’acheteur.</p>
<h2>Article 10 – Délais d’intervention</h2>
<p>Sauf en cas de force majeure ou lors des périodes de fermeture clairement annoncées sur la page d’accueil du site, les délais<br/>
d’intervention seront, dans la limite des disponibilités du prestataire, ceux indiqués ci-dessous. Les délais d’exécution courent<br/>
à compter de la date d’enregistrement de la commande indiquée sur le mail de confirmation de la commande.<br/>
Pour les prestations réalisées en France Métropole, le délai est de __________ jours ouvrables à compter du jour suivant celui<br/>
où l’acheteur a passé sa commande.<br/>
En cas de retard, la responsabilité du prestataire ne pourra être engagée, et ce, pour quelque cause que ce soit. Par conséquent,<br/>
aucune demande d’indemnisation, de quelque nature que ce soit, ne pourra être réclamée par l’acheteur.<br/>
En cas d’indisponibilité du prestataire pour réaliser la prestation, l’acheteur en sera informé au plus tôt et aura la possibilité<br/>
d’annuler sa commande. L’acheteur aura alors la possibilité de demander le remboursement des sommes versées dans les 30<br/>
jours au plus tard de leur versement.</p>
<h2>Article 11 – Modalités de réalisation</h2>
<p>La réalisation n’est entamée qu’après confirmation du paiement par l’organisme bancaire du prestataire.<br/>
Elle est fournie dans le délai prévu sur le bon de commande, à compter de la réception par le prestataire du bon de<br/>
commande.<br/>
En cas de non-respect des conditions de paiement figurant ci-dessus, le vendeur pourra susepndre ou annuler la prestation.<br/>
La prestation est réalisée à l’adresse indiquée par l’acheteur sur le bon de commande. L’acheteur devra veiller à son exactitude.<br/>
Tout déplacement en pure perte du prestataire à cause d’une adresse erronée ou incomplète sera facturé à l’acheteur. L’acheteur<br/>
peut, à sa demande, obtenir l’envoi d’une facture à l’adresse de facturation et non à l’adresse de livraison, en validant l’option<br/>
prévue à cet effet sur le bon de commande.<br/>
L’acheteur veillera à donner accès au prestataire notamment s’il n’est pas personnellement présent le jour de la réalisation de la<br/>
prestation.<br/>
La fin de la prestation donnera lieu à un document de fin d’intervention. L’acheteur doit indiquer sur ce document et sous<br/>
forme de réserves manuscrites accompagnées de sa signature toute anomalie concernant la prestation ou les conditions de sa<br/>
réalisation.<br/>
Cette vérification est considérée comme effectuée dès lors que l’acheteur, ou une personne autorisée par lui, a signé le<br/>
document de fin d’intervention.</p>
<h2>Article 12 – Obligations du prestataire</h2>
<p>Les engagements du prestataire constituent une obligation de moyens au terme de laquelle les prestations seront exécutées<br/>
dans le strict respect des règles professionnelles en usage ainsi, le cas échéant, que conformément aux conditions du contrat.<br/>
Pour ce faire, le prestataire affectera à l’exécution des prestations les professionnels dotés des compétences requises pour<br/>
assurer leur réalisation conformément à ses standards de qualité.</p>
<h2>Article 13 – Obligations de l’acheteur</h2>
<p>Afin de faciliter la bonne exécution des prestations, l’acheteur s’engage :<br/>
à fournir au prestataire des informations et documents complets, exacts et dans les délais nécessaires sans qu’il soit<br/>
tenu d’en vérifier le caractère complet ou l’exactitude ;<br/>
à prendre les décisions dans les délais et d’obtenir les approbations hiérarchiques nécessaires ;<br/>
à désigner un correspondant investi d’un pouvoir de décision ;<br/>
à faire en sorte que les interlocuteurs clés et le correspondant soient disponibles tout au long de l’exécution des<br/>
prestations ;<br/>
à avertir directement le prestataire de toute difficulté éventuelle relative à l’exécution des prestations.</p>
<h2>Article 14 – Informations et publicité</h2>
<p>L’acheteur reconnaît et accepte :<br/>
que les parties pourront sauf demande expresse contraire de l’autre partie, correspondre ou transférer des documents<br/>
par courrier électronique circulant sur le réseau internet ;<br/>
qu’aucune des parties n’exerce de maîtrise sur la capacité, la fiabilité, l’accès ou la sécurité de ces courriers<br/>
électroniques ;<br/>
que le prestataire ne saura être tenu pour responsables de toute perte, dommage, frais ou préjudice occasionnés par la<br/>
perte, le retard, l’interception, le détournement ou l’altération de tout courrier électronique causés par un fait<br/>
quelconque. De façon générale, les parties s’engagent à respecter la réglementation applicable à la protection des<br/>
données personnelles et notamment les dispositions de la loi 78-17 du 6 janvier 1978 relative à l’informatique, aux<br/>
fichiers et aux libertés.</p>
<h2>Article 15 – Propriété intellectuelle</h2>
<p>Au cas où l’une des recommandations du prestataire ou l’utilisation d’éléments livrés à la suite de l’une de ses préconisations<br/>
impliquerait l’utilisation de biens, modèles, dessins, photographies, etc. faisant l’objet de droits de propriété intellectuelle<br/>
appartenant à des tiers, le prestataire informera l’acheteur de l’existence de ces droits et des conséquences de leur utilisation. Il<br/>
appartiendra alors à l’acheteur et sous sa seule responsabilité de prendre toute mesure permettant l’utilisation de tels droits,<br/>
notamment en négociant pour son propre compte les droits d’utilisation dans des conditions telles que le prestataire soit en<br/>
mesure de s’en prévaloir pour les besoins des prestations.<br/>
Pour les besoins propres des prestations, le prestataire pourra utiliser ou développer des logiciels, y compris des feuilles de<br/>
calculs, des documents, des bases de données et d’autres outils informatiques.<br/>
Dans certains cas, ces aides peuvent être mises à la disposition de l’acheteur et sur sa demande. Dans la mesure où ces outils<br/>
ont été développés spécifiquement pour les besoins du prestataire et sans considération des besoins propres de l’acheteur,<br/>
ceux-ci sont mis à disposition de l’acheteur pendant la durée du contrat en l’état et sans aucune garantie attachée, à simple<br/>
destination d’usage ; ils ne devront être distribués, partagés ou communiqués à des tiers que ce soit en tout ou partie. Cette<br/>
mise à disposition temporaire n’emportera aucune cession de droits ni garantie, quel qu’en soit le titre, au bénéfice de<br/>
l’acheteur ou celui du tiers.<br/>
Le prestataire se réserve tout droit, titre et intérêt sur :<br/>
les éléments originaux figurant dans les travaux, documents, mémos, consultations, avis, conclusions ou autres actes<br/>
de procédure, etc. réalisés dans le cadre des prestations, y compris de façon non limitative, tout droit d’auteur, marque<br/>
déposée et tout autre droit de propriété intellectuelle s’y rapportant ;<br/>
toutes les méthodes, processus, techniques, développements, et savoir-faire incorporés ou non des prestations ou que le<br/>
prestataire serait amené à développer ou à fournir dans le cadre des prestations.<br/>
L’acheteur pourra, sans limitation géographique, à titre gratuit et irrévocable, utiliser de manière interne et pour la durée de<br/>
protection par le droit d’auteur, les éléments conçus par le prestataire et intégrés dans ses travaux. L’acheteur s’interdit de</p>
<p>distribuer, commercialiser, et plus généralement de mettre à disposition ou de concéder l’utilisation de ces mêmes réalisations<br/>
et plus généralement de concéder l’utilisation de ces mêmes éléments à des tiers sans l’accord du prestataire.<br/>
Aucune partie ne pourra faire mention ou usage du nom, de la dénomination, des marques et logos ou autres appellations,<br/>
commerciales ou non, de l’autre partie sans accord préalable et écrit de cette dernière. Par dérogation à ce qui précède, le<br/>
prestataire pourra faire usage du nom, de la dénomination, des marques et logos de l’acheteur en cours de contrat dans la<br/>
mesure de ce qui est strictement nécessaire à l’exécution des prestations, y compris dans des propositions de prestations<br/>
ultérieures. Par ailleurs, l’acheteur autorise le prestataire, à l’issue de la réalisation des prestations, à citer son<br/>
nom/dénomination à titre de référence et accompagner cette citation, le cas échéant, d’une description générique des<br/>
prestations effectuées.</p>
<h2>Article 16 – Documents</h2>
<p>Le prestataire conservera les documents originaux qui lui auront été remis, et les restituera à l’acheteur, sur sa demande. Tous<br/>
les documents, données ou informations, que l’acheteur aura fournies, resteront sa propriété.<br/>
Le prestataire conservera une copie des seuls documents nécessaires à la constitution de ses dossiers de travail.<br/>
Les documents de travail préparés dans le cadre des prestations sont notre propriété et sont couverts par le secret<br/>
professionnel.</p>
<h2>Article 17 – Indépendance</h2>
<p>Dans l’hypothèse où un conflit d’intérêt ou une problématique d’indépendance surviendrait au cours de l’exécution des<br/>
prestations, le prestataire en fera part immédiatement à l’acheteur et recherchera avec lui la solution la plus adaptée à la<br/>
situation dans le respect des règles applicables. Plus particulièrement, si une modification de la réglementation ou des normes<br/>
professionnelles interdisait au prestataire de poursuivre ses prestations, il mettra à la disposition de l’acheteur le résultat des<br/>
prestations ainsi que tous documents nécessaires à leur finalisation, y compris ses Documents en l’état, et ce, afin d’en faciliter<br/>
la poursuite par un tiers.</p>
<h2>Article 18 – Responsabilité du prestataire</h2>
<p>L’entière responsabilité du prestataire et celle de ses collaborateurs relative à tout manquement, négligence ou faute, relevé à<br/>
l’occasion de l’exécution des prestations, sera plafonnée au montant des honoraires versés au titre des prestations mises en<br/>
cause, afin de couvrir les réclamations de toute nature (intérêts et frais inclus), et ce, quel que soit le nombre d’actions, de<br/>
fondements invoqués, ou de parties aux litiges.<br/>
Cette stipulation ne s’appliquera pas à une responsabilité pour décès ou blessure corporelle, ni à toute autre responsabilité que<br/>
la loi interdit d’exclure ou de limiter.<br/>
La responsabilité du prestataire ne peut être engagée qu’en cas de faute ou de négligence prouvée et est limitée aux préjudices<br/>
directs à l’exclusion de tout préjudice indirect, de quelque nature que ce soit.<br/>
Par ailleurs, la responsabilité du prestataire ne pourra être engagée dans les cas suivants :<br/>
suite à un manquement ou à une carence d’un produit ou d’un service dont la fourniture ou la livraison ne lui incombe<br/>
pas ni à ses sous-traitants éventuels ;<br/>
pour les faits et/ou données qui n’entrent pas dans le périmètre des prestations, et/ou qui n’en sont pas le<br/>
prolongement ;<br/>
en cas d’utilisation des résultats des prestations, pour un objet ou dans un contexte différent de celui dans lequel il est<br/>
intervenu, de mise en oeuvre erronée des recommandations ou d’absence de prise en compte des réserves du<br/>
prestataire.<br/>
Le prestataire ne répond ni ses assureurs ni des dommages indirects, ni du manque à gagner ou de la perte de chance ou de<br/>
bénéfices escomptés, ni des conséquences financières des actions éventuellement intentées par des tiers à l’encontre de<br/>
l’acheteur.</p>
<h2>Article 19 – Garantie</h2>
<p>Le prestataire garantit l’acheteur contre tout défaut de conformité des services et tout vice caché provenant d’un défaut de<br/>
conception ou de fourniture desdits services à l’exclusion de toute négligence ou faute de l’acheteur.<br/>
En tout état de cause, au cas où la responsabilité du prestataire serait retenue, la garantie du prestataire serait limitée au<br/>
montant HT payé par l’acheteur pour la fourniture des services.</p>
<h2>Article 20 – Cessibilité et sous-traitance</h2>
<p>Le prestataire se réserve le droit de céder tout ou partie de l’exécution des prestations à des prestataires répondant aux mêmes<br/>
exigences de qualification.<br/>
Si la prestation requiert des compétences techniques particulières, le prestataire informera l’acheteur sur la possibilité d’en<br/>
sous-traiter une partie. Le sous-traitant interviendra alors sous la seule responsabilité du prestataire et s’engagera à conserver<br/>
confidentielles toutes les informations dont il aura connaissance à l’occasion des prestations.</p>
<h2>Article 21 – Réclamations</h2>
<p>Toutes les réclamations, qu’elles soient amiables ou judiciaires, relatives à l’exécution des prestations devront être formulées<br/>
dans un délai d’une année à compter de la fin de la réalisation de la prestation.</p>
<h2>Article 22 – Droit de rétractation</h2>
<p>L’acheteur étant un professionnel achetant dans le cadre et pour les besoins de sa profession, il n’y a pas lieu d’appliquer le<br/>
droit de rétractation prévu par le code de la consommation.</p>
<h2>Article 23 – Force majeure</h2>
<p>Toutes circonstances indépendantes de la volonté des parties, empêchant l’exécution dans des conditions normales de leurs<br/>
obligations, sont considérées comme des causes d’exonération des obligations des parties et entraînent leur suspension.<br/>
La partie qui invoque les circonstances visées ci-dessus doit avertir immédiatement l’autre partie de leur survenance, ainsi que<br/>
de leur disparition.<br/>
Seront considérés comme cas de force majeure tous faits ou circonstances irrésistibles, extérieurs aux parties, imprévisibles,<br/>
inévitables, indépendants de la volonté des parties et qui ne pourront être empêchés par ces dernières, malgré tous les efforts<br/>
raisonnablement possibles. De façon expresse, sont considérés comme cas de force majeure ou cas fortuits, outre ceux<br/>
habituellement retenus par la jurisprudence des cours et des tribunaux français : le blocage des moyens de transports ou<br/>
d’approvisionnements, tremblements de terre, incendies, tempêtes, inondations, foudre, l’arrêt des réseaux de<br/>
télécommunication ou difficultés propres aux réseaux de télécommunication externes aux clients.<br/>
Les parties se rapprocheront pour examiner l’incidence de l’événement et convenir des conditions dans lesquelles l’exécution<br/>
du contrat sera poursuivie. Si le cas de force majeure a une durée supérieure à trois mois, les présentes conditions générales<br/>
pourront être résiliées par la partie lésée.</p>
<h2>Article 24 – Non-validation partielle</h2>
<p>Si une ou plusieurs stipulations des présentes conditions générales sont tenues pour non valides ou déclarées telles en<br/>
application d’une loi, d’un règlement ou à la suite d’une décision définitive d’une juridiction compétente, les autres stipulations<br/>
garderont toute leur force et leur portée.</p>
<h2>Article 25 – Non-renonciation</h2>
<p>Le fait pour l’une des parties de ne pas se prévaloir d’un manquement par l’autre partie à l’une quelconque des obligations<br/>
visées dans les présentes conditions générales ne saurait être interprété pour l’avenir comme une renonciation à l’obligation en<br/>
cause.</p>
<h2>Article 26 – Titre</h2>
<p>En cas de difficulté d’interprétation entre l’un quelconque des titres figurant en tête des clauses, et l’une quelconque des<br/>
clauses, les titres seront déclarés inexistants.</p>
<h2>Article 27 – Protection des données personnelles</h2>
<h3>Données collectées</h3>
<p>Les données à caractère personnel qui sont collectées sur ce site sont les suivantes :<br/>
ouverture de compte: lors de la création du compte de l’utilisateur, ses nom ; prénom ; adresse électronique ; n° de téléphone<br/>
; adresse postale ;<br/>
connexion : lors de la connexion de l’utilisateur au site web, celui-ci enregistre, notamment, ses nom, prénom, données de<br/>
connexion, d’utilisation, de localisation et ses données relatives au paiement ;</p>
<p>profil : l’utilisation des prestations prévues sur le site web permet de renseigner un profil, pouvant comprendre une adresse et<br/>
un numéro de téléphone ;<br/>
paiement : dans le cadre du paiement des produits et prestations proposés sur le site web, celui-ci enregistre des données<br/>
financières relatives au compte bancaire ou à la carte de crédit de l’utilisateur ;<br/>
communication : lorsque le site web est utilisé pour communiquer avec d’autres membres, les données concernant les<br/>
communications de l’utilisateur font l’objet d’une conservation temporaire ;<br/>
cookies : les cookies sont utilisés, dans le cadre de l’utilisation du site. L’utilisateur a la possibilité de désactiver les cookies à<br/>
partir des paramètres de son navigateur.</p>
<h3>Utilisation des données personnelles</h3>
<p>Les données personnelles collectées auprès des utilisateurs ont pour objectif la mise à disposition des services du site web,<br/>
leur amélioration et le maintien d��un environnement sécurisé. Plus précisément, les utilisations sont les suivantes :<br/>
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
<h3>Partage des données personnelles avec des tiers</h3>
<p>Les données personnelles peuvent être partagées avec des sociétés tierces, dans les cas suivants :<br/>
– quand l’utilisateur utilise les services de paiement, pour la mise en oeuvre de ces services, le site web est en relation avec<br/>
des sociétés bancaires et financières tierces avec lesquelles elle a passé des contrats ;<br/>
– lorsque l’utilisateur publie, dans les zones de commentaires libres du site web, des informations accessibles au public ;<br/>
– quand l’utilisateur autorise le site web d’un tiers à accéder à ses données ;<br/>
– quand le site web recourt aux services de prestataires pour fournir l’assistance utilisateurs, la publicité et les services de<br/>
paiement. Ces prestataires disposent d’un accès limité aux données de l’utilisateur, dans le cadre de l’exécution de ces<br/>
prestations, et ont une obligation contractuelle de les utiliser en conformité avec les dispositions de la réglementation<br/>
applicable en matière protection des données à caractère personnel ;<br/>
– si la loi l’exige, le site web peut effectuer la transmission de données pour donner suite aux réclamations présentées contre<br/>
le site web et se conformer aux procédures administratives et judiciaires ;<br/>
– si le site web est impliquée dans une opération de fusion, acquisition, cession d’actifs ou procédure de redressement<br/>
judiciaire, elle pourra être amenée à céder ou partager tout ou partie de ses actifs, y compris les données à caractère personnel.<br/>
Dans ce cas, les utilisateurs seraient informés, avant que les données à caractère personnel ne soient transférées à une tierce<br/>
partie.</p>
<h3>Sécurité et confidentialité</h3>
<p>Le site web met en oeuvre des mesures organisationnelles, techniques, logicielles et physiques en matière de sécurité du<br/>
numérique pour protéger les données personnelles contre les altérations, destructions et accès non autorisés. Toutefois, il est à<br/>
signaler qu’internet n’est pas un environnement complètement sécurisé et le site web ne peut pas garantir la sécurité de la<br/>
transmission ou du stockage des informations sur internet.</p>
<h3>Mise en oeuvre des droits des utilisateurs</h3>
<p>En application de la réglementation applicable aux données à caractère personnel, les utilisateurs disposent des droits ci-<br/>
dessous mentionnés, qu’ils peuvent exercer en faisant leur demande à l’adresse suivante : contact@guides-digitaux.com</p>
<p>Le droit d’accès : ils peuvent exercer leur droit d’accès, pour connaître les données personnelles les concernant. Dans<br/>
ce cas, avant la mise en œuvre de ce droit, le site web peut demander une preuve de l’identité de l’utilisateur afin d’en<br/>
vérifier l’exactitude.<br/>
Le droit de rectification : si les données à caractère personnel détenues par le site web sont inexactes, ils peuvent<br/>
demander la mise à jour des informations.<br/>
Le droit de suppression des données : les utilisateurs peuvent demander la suppression de leurs données à caractère<br/>
personnel, conformément aux lois applicables en matière de protection des données.</p>
<p>Le droit à la limitation du traitement : les utilisateurs peuvent de demander au site web de limiter le traitement des<br/>
données personnelles conformément aux hypothèses prévues par le RGPD.<br/>
Le droit de s’opposer au traitement des données : les utilisateurs peuvent s’opposer à ce que ses données soient traitées<br/>
conformément aux hypothèses prévues par le RGPD.<br/>
Le droit à la portabilité : ils peuvent réclamer que le site web leur remette les données personnelles qui lui sont<br/>
fournies pour les transmettre à un nouveau site web.</p>
<h3>Evolution de la présente clause</h3>
<p>Le site web se réserve le droit d’apporter toute modification à la présente clause relative à la protection des données à<br/>
caractère personnel à tout moment. Si une modification est apportée à la présente clause de protection des données à caractère<br/>
personnel, le site web s’engage à publier la nouvelle version sur son site. Le site web informera également les utilisateurs de<br/>
la modification par messagerie électronique, dans un délai minimum de 15 jours avant la date d’effet. Si l’utilisateur n’est pas<br/>
d’accord avec les termes de la nouvelle rédaction de la clause de protection des données à caractère personnel, il a la<br/>
possibilité de supprimer son compte.</p>
<h2>Article 28- Loi applicable</h2>
<p>Les présentes conditions générales sont soumises à l’application du droit français. Elles sont rédigées en langue française.<br/>
Dans le cas où elles seraient traduites en une ou plusieurs langues, seul le texte français ferait foi en cas de litige.<br/>
Les parties s’engagent à rechercher une solution amiable à tout différend qui pourrait naître de la réalisation des prestations.<br/>
Si elles n’y parviennent pas, les parties soumettront le litige au tribunal de commerce compétent.</p>
<p> </p>
<p>Ces CGV prestations de services en ligne pour les professionnels ont été créées sur le site Rocket Lawyer.</p>
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
