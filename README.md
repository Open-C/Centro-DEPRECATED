![Centro Header](/client/assets/images/readme-header.png)

Centro is an Android, iOS, and web app that allows Celo users to easily access DeFi protocols and manage their assets. Centro has a simple and standardized user interface, making it easy for novices to engage with dapps on Celo.

Centro empowers users to safely and efficiently manage their assets across the Celo ecosystem while maintaining self-custody. Centro has free cash-in, cash-out, and trading, but we take a small percentage of interest earned on Moola deposits to fund new integrations.



## Integrations
* Valora - connect Centro to your Valora wallet
* Moola Market - UI design, connectors, and front-end (deposit)
* Celo Mento - UI design, connectors
* Ubeswap - UI design, connectors
* Payments - UI design, connectors
* Block Explorer - fully integrated via in-app browser
* Savings Circles - UI design and smart contracts (funds are automatically invested in Moola and earn interest!)
* impactMarket - beneficiary address in wrapper
* Mobile Money Cashout - developer account setup; sandbox testing complete



## Technical Overview 
The Centro app is comprised of four main components: a wallet wrapper, protocol connectors, Celo DappKit, and the react native front-end. 

###### Wallet Wrapper
The wallet wrapper is a smart contract that manages user funds and is only accessible by who created the individual wallet. Using this wrapper, we are able to expand the functionality of a traditional Celo wallet by enabling beneficiary addresses and autonomous transactions. 

###### Protocol Connectors
Our protocol connectors allow the Centro front-end to interact with dapps on Celo. The beauty of our wallet wrapper + protocol connectors is that new functionality can be added (new connectors can be made) without having to update each wallet individually. 

###### Celo DappKit
DappKit is a library made by Celo to help dapps interface with wallets. We used DappKit to allow users to connect their Valora wallet to Centro.

###### React Native
The Centro front-end was made using React Native + Expo. 



## Demo


## Try it Yourself!


## Run it Locally


## Global Impact 
We are extremely excited about Centro's potential for impact, particularly when it comes to the flow of compounded interest. Using our wallet wrapper and impactMarket APIs, we are able to syphon a percentage of interest earned on Moola deposits to UBI beneficiaries around the world! Similarly, users can redirect interest earned to carbon offsetting initiatives, such Project Wren or MOSS Carbon Credits. 

An additional area for impact is where we focus our attention for cash-in/cash-out. While most projects attempt to integrate USD on-/off-ramps, we have focused our attention on mobile-money, the financial fabric of Africa. Specifically, we are integrating the MTN MoMo API, one of the largest mobile money providers in all of Africa. By doing so, we will empower anyone with a smartphone to access Celo services, even if they do not have a bank account. 

Furthermore, we are developing custom smart contracts for impact-specific use cases, such as savings circles and village banking. By providing their traditional financial systems on Centro, we not only emulate but improve their activity by making it safer, more efficient, transparent, global, and near-free. We have already created a UI design for a full-fledged village banking system, and have written the smart contracts for savings circles. What makes this application unique is that circle funds are automatically deposited to Moola market so groups can earn interest on stable-value assets. They can either put this interest in a vault, lottery it off, or distribute it back to the members. We are working to finish the react native front-end ASAP.

## What's Next?
* Finish full-integrations of Moola, Ubeswap, Mento, and Payments
* Start react native for savings circles / village banking, impactMarket, and carbon offsetting
* Add beneficiary functionality 
* Run live tests with the MTN MoMo API and integrate it
* Integrate analytics with The Graph


## Who We Are
Darryl, Dylan, and Eric--the creators of Centro--are all students at Cal Poly San Luis Obispo. We met through Blockchain at Cal Poly (student club) and SLOHacks (hackathon), where we developed a shared passion for decentralized finance. Our past blockchain projects range from savings circles to streamable payments, and we also made [CeloHub](https://celohub.org)--a dapp gallery for the Celo blockchain. Our team has a diverse skillset, and together we form OpenC. Darryl led front-end development with React Native, Dylan led backend architecture + smart contracts with Solidity, and Eric led product. 


## Our Make it Mobile Experience
Centro is part of the Celo Make it Mobile Hackathon with GitCoin. 
-Darryl learned how to use React Native ;p
-Dylan learned how to deploy contracts to Celo
-Eric learned how to limit project scope lol


