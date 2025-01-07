// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address creator;
        uint8 ratingSum;
        uint8 ratingCount;
    }

    Model[] public models;
    mapping(uint256 => address[]) public buyers;

    function listModel(string memory name, string memory description, uint256 price) public {
        models.push(Model(name, description, price, msg.sender, 0, 0));
    }

    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Invalid model ID");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect payment");

        model.creator.transfer(msg.value);
        buyers[modelId].push(msg.sender);
    }

    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Invalid model ID");
        require(rating >= 1 && rating <= 5, "Rating must be between 1 and 5");

        bool isBuyer = false;
        for (uint256 i = 0; i < buyers[modelId].length; i++) {
            if (buyers[modelId][i] == msg.sender) {
                isBuyer = true;
                break;
            }
        }
        require(isBuyer, "Only buyers can rate");

        Model storage model = models[modelId];
        model.ratingSum += rating;
        model.ratingCount++;
    }

    function getModelDetails(uint256 modelId) public view returns (string memory, string memory, uint256, address, uint8) {
        require(modelId < models.length, "Invalid model ID");

        Model storage model = models[modelId];
        uint8 averageRating = model.ratingCount > 0 ? model.ratingSum / model.ratingCount : 0;

        return (model.name, model.description, model.price, model.creator, averageRating);
    }

    function withdrawFunds() public {
        payable(msg.sender).transfer(address(this).balance);
    }
}
