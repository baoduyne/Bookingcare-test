import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from '../../services/userService';
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { Modal } from 'reactstrap';
import { emitter } from '../../utils/emitter';
class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            userEdit: {}
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers("ALL");

        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users
            }, () => {

            })
        }

    }

    handleAddNewUser = (event) => {
        this.setState({ isOpenModalUser: true });
    }
    handleDeleteUser = async (user) => {
        try {

            let response = await deleteUserService(user.id);
            console.log(response);
            if (response && response.errCode === 0) {
                this.getAllUsersFromReact();
            }
            else {
                alert(response.errMessage);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    handleEditUser = (user) => {
        this.toggleEditUserModal();
        this.setState({
            userEdit: user
        })
    }

    editUser = async (user) => {
        try {

            let response = await editUserService(user);
            if (response && response.errCode === 0) {

                this.getAllUsersFromReact();
                this.toggleEditUserModal();
            }
            else {
                console.log(response);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);

            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            }
            else {
                await this.getAllUsersFromReact();
                this.setState({
                    isOpenModalUser: false,
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA',);
            }
        }
        catch (e) {
            console.log(e);
        }
    }



    render() {
        const mdStr = `# This is a H1  \n## This is a H2  \n###### This is a H6`;
        let arrUsers = this.state.arrUsers;
        return (
            <div className="user-container">
                <ModalUser
                    toggleFromParent={this.toggleUserModal}
                    isOpen={this.state.isOpenModalUser}
                    createNewUser={this.createNewUser}
                >
                </ModalUser>
                {
                    this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        toggleFromParent={this.toggleEditUserModal}
                        isOpen={this.state.isOpenModalEditUser}
                        editUser={this.editUser}
                        currentUser={this.state.userEdit}
                    >

                    </ModalEditUser>
                }
                <div className='title text-center'>Manage</div>
                <div className="mx-1">
                    <button
                        onClick={(event) => this.handleAddNewUser(event)}
                        className="btn btn-primary px-3"><i className="fas fa-plus pe-3"></i>Add new users</button>
                </div>
                <div className="user-table mt-4 mx-1">

                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>FirstName</th>
                                <th>LastName</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>

                            {arrUsers && arrUsers.map((item, index) => {
                                return (
                                    <tr>

                                        <td>{item.email}</td>
                                        <td>{item.firstName}</td>
                                        <td>{item.lastName}</td>
                                        <td>{item.address}</td>
                                        <td>
                                            <button className="btn-edit" onClick={() => this.handleEditUser(item)}><i className="far fa-edit"></i></button>
                                            <button className="btn-delete" onClick={() => this.handleDeleteUser(item)}><i className="fas fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                )
                            })

                            }
                        </tbody>
                    </table>

                </div>


            </div>

        );





    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
