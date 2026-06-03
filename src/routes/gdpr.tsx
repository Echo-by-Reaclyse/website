import { createFileRoute } from "@tanstack/react-router";
import { InnerPage, Section } from "@/components/InnerPage";

export const Route = createFileRoute("/gdpr")({
  component: GDPRPage,
});

function GDPRPage() {
  return (
    <InnerPage
      title="GDPR & Internal Data Protection Regulations"
      subtitle="Version of May 2026 — Updated as the company evolves"
    >
      <title>GDPR & Data Protection Regulations — ÉCHO by Réaclyse</title>
      <meta
        name="description"
        content="ÉCHO's internal regulations on personal data management, in accordance with GDPR (EU) 2016/679. How we collect, process, and protect your data."
      />
      <link rel="canonical" href="https://www.echobyreaclyse.com/gdpr" />
      <meta name="robots" content="noindex, follow" />

      {/* ── Notice ── */}
      <div
        style={{
          background: "rgba(191,96,64,0.08)",
          border: "1px solid rgba(191,96,64,0.25)",
          borderRadius: 8,
          padding: "16px 20px",
        }}
        className="leading-relaxed text-muted-foreground"
      >
        <strong className="text-ink">Note on company details:</strong> ÉCHO is developed by{" "}
        <strong>⚠ [COMPANY LEGAL NAME TO BE CONFIRMED UPON INCORPORATION]</strong>,
        a company being established in Luxembourg. Placeholders marked with{" "}
        <strong>⚠ [PLACEHOLDER]</strong> throughout this document must be updated once
        the company is incorporated and roles are formally assigned. Contact:{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        .
      </div>

      {/* ── I. Objectives ── */}
      <Section title="I. Objectives of this regulation">
        <strong>⚠ [COMPANY LEGAL NAME]</strong> (operating as Réaclyse, hereinafter
        "the Company") collects and processes certain personal information about natural
        persons. These individuals may include app users, waitlist subscribers, service
        providers, suppliers, partners, and any other persons with whom the Company has or
        must have relations.
        <br />
        <br />
        These internal regulations on the management and protection of personal data
        (hereinafter the "Regulations") describe how such personal data must be collected,
        processed, and stored in order to meet the Company's protection standards and keep
        it in compliance with applicable law.
        <br />
        <br />
        These Regulations are a general policy that may be supplemented over time by
        specific policies (e.g., a Data Retention Policy, a Data Breach Protocol, or an
        Employee Data Policy).
        <br />
        <br />
        The Company is responsible for its compliance with applicable laws and regulations
        and must be able to demonstrate this at all times in accordance with the principle
        of accountability under Article 5(2) GDPR.
      </Section>

      {/* ── II. Scope ── */}
      <Section title="II. Scope and updating of these regulations">
        These Regulations apply to all operations of the Company that involve the
        processing of personal data and must be complied with by all members of staff,
        including directors and employees, temporary staff, seconded staff, consultants,
        advisors, and contractors.
        <br />
        <br />
        The processing of personal data is any action — collection, encoding, reproduction,
        storage, transformation, sharing, deletion, etc. — carried out on data relating to
        identified or identifiable natural persons. This includes app users, waitlist
        subscribers, and any contact persons for partner companies.
        <br />
        <br />
        These Regulations are adopted and may be updated at any time by the Company. The
        version date shown above reflects the most recent update.
      </Section>

      {/* ── III. Applicable law ── */}
      <Section title="III. Applicable law and definitions">
        Various national and international laws protect the rights of individuals with
        regard to their privacy and the processing of data concerning them. The primary
        applicable regulation is:
        <br />
        <br />
        <strong>Regulation (EU) 2016/679</strong> of the European Parliament and of the
        Council of 27 April 2016 on the protection of individuals with regard to the
        processing of personal data and on the free movement of such data, and repealing
        Directive 95/46/EC (the "General Data Protection Regulation" or "GDPR").
        <br />
        <br />
        As a company incorporated in Luxembourg, the Company is also subject to the
        Luxembourg Law of 1 August 2018 on the organisation of the Commission nationale
        pour la protection des données and the general data protection framework.
        <br />
        <br />
        Certain terms used in this Regulation have particular meanings as established in
        Article 4 of the GDPR. Key terms include: "personal data," "processing,"
        "controller," "processor," "data subject," "consent," and "personal data breach."
      </Section>

      {/* ── IV. General principles ── */}
      <Section title="IV. General principles applying to the processing of personal data">
        Any processing of personal data by or on behalf of the Company must comply with
        the following principles.
        <br />
        <br />
        <strong>Lawfulness, fairness, and transparency.</strong> Data may only be
        processed if at least one of the following conditions is met:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>The data subject has given consent (under certain conditions);</li>
          <li>
            Processing is necessary for the performance of a contract to which the data
            subject is a party, or to take steps at their request prior to entering a
            contract;
          </li>
          <li>Processing is necessary to comply with a legal obligation;</li>
          <li>
            Processing is necessary to protect the vital interests of the data subject or
            another natural person;
          </li>
          <li>
            Processing is necessary for the purposes of the legitimate interests pursued
            by the Company (under certain conditions, and not where overridden by the data
            subject's interests or rights).
          </li>
        </ul>
        <br />
        <strong>Purpose limitation.</strong> Personal data may only be processed for
        clearly limited and defined purposes that are lawful and communicated to the data
        subject before processing takes place.
        <br />
        <br />
        <strong>Data minimisation.</strong> The number and nature of data processed must
        be adequate, relevant, and not excessive in relation to the purpose.
        <br />
        <br />
        <strong>Accuracy.</strong> All personal data must be accurate, complete, and kept
        up to date. Inaccurate, incomplete, or out-of-date data should be corrected or
        deleted.
        <br />
        <br />
        <strong>Storage limitation.</strong> Personal data must not be kept longer than
        necessary. Data retention periods are set out in our Data Retention Policy.
        <br />
        <br />
        <strong>Integrity and confidentiality.</strong> All personal data must be subject
        to appropriate organisational and security measures to ensure it is secure and
        that appropriate levels of confidentiality are maintained. Unauthorised persons
        must not have access to personal data. Paper copies not intended for permanent
        filing must be treated as confidential waste and shredded.
      </Section>

      {/* ── V. DPC ── */}
      <Section title="V. Internal data protection coordinator">
        The Company has appointed (or will appoint upon incorporation) a{" "}
        <strong>Data Protection Coordinator</strong> (hereinafter "DPC") from among its
        staff.
        <br />
        <br />
        Data subjects may contact the DPC for any general questions relating to the
        processing of personal data within the Company, including compliance with these
        Regulations.
        <br />
        <br />
        <strong>DPC contact:</strong>{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        <br />
        <br />
        <strong>
          ⚠ [NAME OF DPC — TO BE DESIGNATED UPON COMPANY INCORPORATION]
        </strong>
        <br />
        <br />
        As of the date of these Regulations, data protection enquiries are handled
        directly by the founding team at the contact address above.
      </Section>

      {/* ── VI. Rights ── */}
      <Section title="VI. Rights of data subjects">
        The natural persons concerned enjoy the following rights under the GDPR. The
        Company ensures that these rights can be exercised effectively.
        <br />
        <br />
        <strong>Right to be informed.</strong> Data subjects receive information about the
        processing of their personal data through relevant, complete, and up-to-date
        privacy policies published on our website and accessible within the ÉCHO app.
        <br />
        <br />
        <strong>Right of access.</strong> The data subject has the right to obtain
        confirmation that the Company is processing personal data concerning them, and to
        access that data and certain legal information. This right must not infringe the
        rights and freedoms of others.
        <br />
        <br />
        <strong>Right of rectification.</strong> The data subject has the right to obtain
        without undue delay the rectification of inaccurate personal data, and in certain
        cases to complete incomplete personal data.
        <br />
        <br />
        <strong>Right to erasure (right to be forgotten).</strong> In certain cases, the
        data subject has the right to obtain the erasure of personal data without undue
        delay — in particular where the data is no longer necessary for the purposes for
        which it was collected, where consent is withdrawn and no other legal basis
        applies, or where the data has been unlawfully processed. In ÉCHO: use{" "}
        <em>Settings → Delete Account</em> to permanently erase all app data.
        <br />
        <br />
        <strong>Right to restriction of processing.</strong> In certain cases, the data
        subject has the right to restrict processing (marking stored data with a view to
        limiting future processing). Restricted data is only processed with the data
        subject's consent, for legal claims, or to protect the rights of others.
        <br />
        <br />
        <strong>Right to data portability.</strong> In certain cases, the data subject has
        the right to receive their personal data in a structured, commonly used,
        machine-readable format, and to transmit it to another organisation without
        hindrance. In ÉCHO: use <em>Settings → Export</em> to download your data.
        <br />
        <br />
        <strong>Right to object.</strong> The data subject has the right to object at any
        time to the processing of personal data for direct marketing purposes. In certain
        other cases, the data subject may also object to other specific processing
        activities. The data subject has the right not to be subject to decisions based
        solely on automated processing, including profiling, that produces legal or
        similarly significant effects — unless based on contract, law, or explicit consent,
        with appropriate human oversight safeguards in place.
        <br />
        <br />
        <strong>Right to lodge a complaint.</strong> In any event, the data subject has
        the right to lodge a complaint with a supervisory authority — in Luxembourg, the
        Commission nationale pour la protection des données (CNPD) at{" "}
        <strong>⚠ [CNPD contact details — cnpd.public.lu]</strong>.
      </Section>

      {/* ── VII. Consent ── */}
      <Section title="VII. Consent">
        Where the legal basis for processing personal data is the data subject's consent:
        <br />
        <br />
        <ol style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>
            The Company must be able to demonstrate that consent was given. Adequate
            technical means are deployed for this purpose (e.g., timestamped consent
            records).
          </li>
          <li>
            Where consent is obtained alongside other matters (e.g., terms of service),
            the request for consent is clearly distinguishable, comprehensible, and
            formulated in plain language.
          </li>
          <li>
            <strong>The data subject has the right to withdraw consent at any time.</strong>{" "}
            Withdrawal does not affect the lawfulness of processing before withdrawal.
            Data subjects are informed of this before giving consent. Withdrawing consent
            is as easy as giving it (e.g., toggling AI insights off in Settings).
          </li>
        </ol>
        <br />
        Given the strict conditions for valid consent under the GDPR and the legal
        uncertainty arising from its use, consent is only relied upon where no other legal
        basis for processing is available. The DPC is consulted before implementing any
        processing based on consent.
        <br />
        <br />
        Consent is obtained and managed in accordance with the guidelines of the European
        Data Protection Board (EDPB).
      </Section>

      {/* ── VIII. Handling requests ── */}
      <Section title="VIII. Handling requests from data subjects">
        Persons wishing to exercise their rights must submit requests in writing to the
        DPC at:{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        . Oral requests cannot be processed.
        <br />
        <br />
        If necessary, the data subject may be asked to provide reasonable proof of
        identity before the request is fulfilled.
        <br />
        <br />
        All requests are handled in accordance with applicable GDPR timelines — a response
        will be provided within <strong>30 days</strong> of receipt (extendable by a
        further two months for complex or numerous requests, with notice given).
        <br />
        <br />
        Data subjects may make repeated requests at reasonable intervals. Data subjects
        also have the right to challenge the Company regarding its compliance with these
        Regulations and applicable data protection laws; such challenges must be addressed
        in writing to the DPC.
      </Section>

      {/* ── IX. Management ── */}
      <Section title="IX. Management and review of data processing activities">
        For the purposes of good governance and accountability, all personal data
        processing activities for which the Company is responsible are documented in a{" "}
        <strong>processing register</strong> made available to the DPC and the supervisory
        authority upon request.
        <br />
        <br />
        When determining the means of processing and during processing itself, the Company
        applies appropriate technical and organisational safeguards to protect the rights
        of data subjects.
        <br />
        <br />
        Personal data processing activities are reviewed by the DPC to ensure compliance
        with law and these Regulations. Any doubts regarding the validity of a data
        processing activity must be reported to the DPC.
        <br />
        <br />
        Any <strong>new activity</strong> involving personal data processing must be
        discussed and approved by the DPC before implementation.
        <br />
        <br />
        Before introducing new technologies or launching new processing likely to entail a
        high risk to the rights and freedoms of data subjects, the Company — in
        collaboration with the DPC — will assess the need to carry out a{" "}
        <strong>Data Protection Impact Assessment (DPIA)</strong>.
        <br />
        <br />
        The Company implements privacy-by-design and privacy-by-default: only data
        necessary for each specific purpose is processed, and default settings ensure
        minimal risk to data subject privacy.
      </Section>

      {/* ── X. Personnel guidelines ── */}
      <Section title="X. General guidelines for Company personnel">
        Anyone working for the Company who has access to personal data must read,
        understand, and comply with these Regulations and the following behavioural
        principles:
        <br />
        <br />
        <ol style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>
            Process personal data only with approved tools and procedures; avoid
            unauthorised third-party software unless cleared by the DPC.
          </li>
          <li>Do not duplicate personal data unless absolutely necessary.</li>
          <li>
            When recording personal data, record only what is necessary and avoid encoding
            errors.
          </li>
          <li>
            When collecting data, explain why it is needed and for what purpose; refer to
            the applicable privacy policy.
          </li>
          <li>
            Update data when the opportunity arises; correct errors and delete out-of-date
            or obsolete data.
          </li>
          <li>
            Do not transfer or communicate personal data unless it is part of the normal
            procedure and justified.
          </li>
          <li>
            When transferring or receiving data, delete any unnecessary or residual copies.
          </li>
          <li>
            Respect a general confidentiality ethic — do not consult files you are not
            authorised to access, and do not discuss personal information unnecessarily.
          </li>
          <li>
            Respect IT security rules: protect passwords, report malfunctions, and use
            only approved software.
          </li>
          <li>
            If you access data you should not have access to, contact the DPC immediately.
          </li>
          <li>
            If you suspect that data may have been lost, damaged, or accessed by
            unauthorised persons, inform the DPC immediately.
          </li>
          <li>
            If you have any doubts or questions about these Regulations, contact the DPC.
          </li>
        </ol>
        <br />
        The Company will arrange training where possible to help staff understand their
        responsibilities and how best to handle personal data.
      </Section>

      {/* ── XI. Data security ── */}
      <Section title="XI. Data security">
        It is the Company's responsibility to secure personal data and its processing. To
        this end, the Company implements appropriate technical and organisational measures
        to ensure a level of security appropriate to the risks, including:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>
            <strong>On-device processing:</strong> Voice transcription via WhisperKit runs
            entirely on the user's iPhone — audio is never transmitted to external servers
            for this purpose.
          </li>
          <li>
            <strong>Encryption at rest:</strong> Recordings and transcripts are encrypted
            on-device and within iCloud (CloudKit).
          </li>
          <li>
            <strong>Keychain storage:</strong> Sensitive credentials (API keys) are stored
            exclusively in the iOS Keychain with{" "}
            <code>kSecAttrAccessibleWhenUnlockedThisDeviceOnly</code>.
          </li>
          <li>
            <strong>Access control:</strong> Only authorised personnel have access to
            backend infrastructure; access is controlled via role-based permissions.
          </li>
          <li>
            <strong>Minimal data transmission:</strong> Only anonymised reflection text is
            sent to AI providers; no names, emails, or device identifiers are included.
          </li>
        </ul>
        <br />
        The vast majority of security incidents involve human error. The Company has
        adopted specific policies on the use of IT systems and infrastructure to mitigate
        this risk.
        <br />
        <br />
        <strong>⚠ [FORMAL IT SECURITY POLICY TO BE DOCUMENTED UPON INCORPORATION]</strong>
      </Section>

      {/* ── XII. Third parties ── */}
      <Section title="XII. Contracts with third parties and processors">
        Where the Company executes contracts with third parties under which personal data
        is transferred or disclosed, such contracts include provisions requiring the third
        party to comply with applicable data protection laws.
        <br />
        <br />
        Contracts with third parties who process personal data on behalf of the Company
        (sub-processors / data processors) must include the mandatory clauses required by
        Article 28 GDPR (Data Processing Agreements). A copy of any contract involving
        the transfer of personal data to third parties must be provided to the DPC for
        review.
        <br />
        <br />
        Current third-party processors and services used by ÉCHO include:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>
            <strong>Apple (CloudKit / iCloud):</strong> Optional backup and sync, governed
            by Apple's privacy policy. Data stored within Apple's infrastructure; users
            control sync via in-app settings.
          </li>
          <li>
            <strong>Google (Gemini API):</strong> Anonymised reflection text sent for AI
            insight generation. No identifying information included. Users can disable AI
            insights at any time.
          </li>
          <li>
            <strong>Neon (Database infrastructure):</strong> Backend database for
            server-managed content (e.g., daily questions). No user reflection data
            stored.
          </li>
          <li>
            <strong>Resend:</strong> Transactional email delivery for waitlist
            notifications. Email addresses processed in accordance with Resend's DPA.
          </li>
          <li>
            <strong>Vercel:</strong> Website and API hosting. No user personal data
            processed beyond standard server logs.
          </li>
        </ul>
        <br />
        <strong>
          ⚠ [FORMAL DATA PROCESSING AGREEMENTS TO BE SIGNED WITH EACH PROCESSOR UPON
          COMPANY INCORPORATION]
        </strong>
      </Section>

      {/* ── XIII. International transfers ── */}
      <Section title="XIII. Transfer of data outside the European Union">
        The Company may allow the transfer of personal data outside the EU only after
        ensuring that such data will benefit from the same level of protection as
        guaranteed by European law (GDPR), specifically:
        <br />
        <br />
        <ul style={{ paddingLeft: 20, margin: "8px 0" }}>
          <li>
            The country of destination benefits from an adequacy decision of the EU
            Commission (e.g., transfers to Apple's US infrastructure covered by Apple's
            Data Privacy Framework certification); or
          </li>
          <li>
            Appropriate safeguards are in place (e.g., Standard Contractual Clauses per
            Article 46 GDPR); or
          </li>
          <li>
            The explicit, informed consent of the data subject has been obtained for the
            specific transfer.
          </li>
        </ul>
        <br />
        The DPC must be consulted before transferring any personal data outside the
        European Union.
        <br />
        <br />
        <strong>
          ⚠ [FORMAL TRANSFER IMPACT ASSESSMENTS AND SCCs TO BE COMPLETED FOR EACH
          PROCESSOR UPON COMPANY INCORPORATION]
        </strong>
      </Section>

      {/* ── XIV. Data breach ── */}
      <Section title="XIV. Data breach">
        It is the Company's responsibility to respond promptly and appropriately to
        personal data breaches: to assess the seriousness of the incident and its possible
        consequences, and — where required — to notify the supervisory authority{" "}
        <strong>within 72 hours</strong> of becoming aware of the breach, and/or to notify
        affected data subjects without undue delay.
        <br />
        <br />
        Examples of incidents that may constitute a personal data breach include: theft or
        loss of devices, hacked or compromised passwords, insecure storage or
        transmission, detection of vulnerabilities or malware in IT systems, unauthorised
        access to systems, detection of abnormal activity, erroneous data transfers, etc.
        <br />
        <br />
        Any suspicious event or incident that could lead to a breach of security or data
        access rules must be reported immediately to the DPC at{" "}
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        . The DPC will follow the Data Breach Protocol.
        <br />
        <br />
        <strong>
          ⚠ [FORMAL DATA BREACH PROTOCOL DOCUMENT TO BE CREATED UPON COMPANY
          INCORPORATION]
        </strong>
      </Section>

      {/* ── XV. Cooperation ── */}
      <Section title="XV. Cooperation with the data protection authority">
        The Company cooperates fully with the official data protection authority — in
        Luxembourg, the{" "}
        <strong>
          Commission nationale pour la protection des données (CNPD)
        </strong>{" "}
        — and responds to their questions without undue delay and within applicable legal
        deadlines.
        <br />
        <br />
        The DPC liaises with the data protection authority on behalf of the Company.
        <br />
        <br />
        <strong>
          ⚠ [CNPD REGISTRATION / NOTIFICATION REQUIREMENTS TO BE ASSESSED AND COMPLETED
          UPON COMPANY INCORPORATION —{" "}
          <a
            href="https://cnpd.public.lu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember transition hover:opacity-75"
          >
            cnpd.public.lu
          </a>
          ]
        </strong>
      </Section>

      {/* ── Contact ── */}
      <Section title="Contact & data requests">
        For any question, concern, or request relating to your personal data or these
        Regulations:
        <br />
        <br />
        <strong>⚠ [COMPANY LEGAL NAME]</strong> (Réaclyse) ·{" "}
        <strong>⚠ [REGISTERED ADDRESS — TO BE CONFIRMED]</strong> · Luxembourg
        <br />
        <br />
        <a href="mailto:hello@reaclyse.com" className="text-ember transition hover:opacity-75">
          hello@reaclyse.com
        </a>
        <br />
        <br />
        We respond to all data subject requests within 30 days. For urgent security
        concerns or data breach reports, contact us immediately at the address above.
      </Section>
    </InnerPage>
  );
}
